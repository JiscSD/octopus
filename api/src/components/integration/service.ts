import axios from 'axios';
import * as ariUtils from 'integration/ariUtils';
import * as client from 'lib/client';
import * as ecs from 'lib/ecs';
import * as ingestLogService from 'ingestLog/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

/**
 * Incremental ARI ingest.
 * Paginates through ARI questions from the ARI DB API and handles incoming ARIs.
 * It stops when both of the following conditions are true:
 *   - It encounters MAX_UNCHANGED_STREAK ARIs in a row not requiring changes.
 *   - It encounters an ARI with dateUpdated before the start time of the most
 *       recent successful ingest (if this start time is available).
 */
export const incrementalAriIngest = async (dryRun: boolean, reportFormat: I.IngestReportFormat): Promise<string> => {
    // Check if a process is currently running.
    const lastLog = await ingestLogService.getMostRecentLog('ARI', true);

    if (lastLog && !lastLog.end) {
        if (dryRun) {
            console.log(
                'This run would have been cancelled because another run is currently in progress. However, the run has still been simulated.'
            );
        } else {
            return 'Did not run ingest. Either an import is already in progress or the last import failed.';
        }
    }

    const start = new Date();
    const MAX_UNCHANGED_STREAK = 5;
    // Get most start time of last successful run to help us know when to stop.
    const mostRecentLog = await ingestLogService.getMostRecentLog('ARI');

    if (!mostRecentLog) {
        console.log(
            `Unable to get most recent start time. This job will stop when it encounters ${MAX_UNCHANGED_STREAK} unchanged ARIs, regardless of their dateUpdated value.`
        );
    }

    const mostRecentStart = mostRecentLog?.start;

    // Log start time.
    let logId: string | null = null;

    if (!dryRun) {
        const log = await ingestLogService.create('ARI');
        logId = log.id;
    }

    // Determine which departments are having their ARIs imported.
    const participatingDepartmentNames = await ariUtils.getParticipatingDepartmentNames();

    // Count sequential unchanged ARIs so that we can stop when the streak hits MAX_UNCHANGED_STREAK.
    let unchangedStreak = 0;

    // Track whether we have passed the last successful import start time.
    let timeOverlap = false;

    // Pagination loop.
    let pageUrl = ariUtils.ariEndpoint;
    let paginationInfo;
    // Keep count of things to report on at the end.
    let checkedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;
    const unrecognisedDepartments = new Set<string>();
    const unrecognisedTopics = new Set<string>();

    do {
        // Get page.
        const response = await axios.get(pageUrl);
        const pageAris = response.data.data;

        for (const pageAri of pageAris) {
            // Skip archived ARIs and ones not from one of the participating departments.
            if (!pageAri.isArchived && participatingDepartmentNames.includes(pageAri.department.toLowerCase())) {
                if (mostRecentStart && new Date(pageAri.dateUpdated) < new Date(mostRecentStart) && !timeOverlap) {
                    timeOverlap = true;
                    console.log('Time overlap - reached an ARI older than the most recent ingest start time.');
                }

                // Create, update, or skip this ARI as appropriate.
                const handle = await ariUtils.handleIncomingARI(pageAri, dryRun);
                checkedCount++;

                if (handle.unrecognisedDepartment) {
                    unrecognisedDepartments.add(handle.unrecognisedDepartment);
                }

                if (handle.unrecognisedTopics) {
                    handle.unrecognisedTopics.forEach((topic) => unrecognisedTopics.add(topic));
                }

                if (!handle.success) {
                    console.log(`Error when handling ARI with question ID ${pageAri.questionId}: ${handle.message}`);
                } else if (handle.actionTaken === 'none') {
                    // Success is true and actionTaken is none so there were no changes found.
                    unchangedStreak++;

                    // Quit when we reach MAX_UNCHANGED_STREAK and are not knowingly processing ARIs newer than last ingest.
                    if (unchangedStreak >= MAX_UNCHANGED_STREAK && (timeOverlap || !mostRecentStart)) {
                        break;
                    }
                } else {
                    // This was not a skip so reset unchangedStreak counter.
                    unchangedStreak = 0;

                    if (!dryRun) {
                        // Log action taken.
                        console.log(
                            `ARI ${pageAri.questionId} handled successfully with action: ${handle.actionTaken}`
                        );
                    }

                    // Artificial delay to avoid hitting datacite rate limits with publication creates/updates.
                    // https://support.datacite.org/docs/is-there-a-rate-limit-for-making-requests-against-the-datacite-apis
                    if (handle.actionTaken === 'create') {
                        createdCount++;

                        // Datacite is hit twice, to initialise DOI and get publication ID, then update DOI with data.
                        if (!dryRun) {
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                        }
                    }

                    if (handle.actionTaken === 'update') {
                        updatedCount++;

                        // Datacite is hit once, to update the DOI with changes.
                        if (!dryRun) {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                        }
                    }
                }
            }
        }

        // Get the next page URL.
        // On the last run this will be undefined but that's fine because we won't need to repeat the loop.
        paginationInfo = response.data.meta.pagination;
        pageUrl = paginationInfo.links.next;
    } while (pageUrl && unchangedStreak < MAX_UNCHANGED_STREAK && !timeOverlap && participatingDepartmentNames.length);

    const end = new Date();
    // Get duration in seconds to the nearest 1st decimal place.
    const durationSeconds = Math.round((end.getTime() - start.getTime()) / 100) / 10;

    if (!dryRun && logId) {
        await ingestLogService.setEndTime(logId, end);
    }

    await ariUtils.ingestReport(reportFormat, {
        checkedCount,
        durationSeconds,
        createdCount,
        updatedCount,
        unrecognisedDepartments: Array.from(unrecognisedDepartments).sort(),
        unrecognisedTopics: Array.from(unrecognisedTopics).sort(),
        dryRun,
        full: false
    });

    const writeCount = createdCount + updatedCount;

    const preamble = dryRun ? 'Dry run complete. Would have updated' : 'Update complete. Updated';

    return `${preamble} ${writeCount} publication${writeCount !== 1 ? 's' : ''}.`;
};

/**
 * Check for newly archived ARIs. If an ARI previously imported to octopus has been archived in the ARI DB,
 * it will be marked as archived in octopus.
 */
export const checkArchivedARIs = async (
    allDepartments: boolean,
    dryRun: boolean,
    reportFormat: I.IngestReportFormat
): Promise<string> => {
    const startTime = performance.now();

    console.log(`${((performance.now() - startTime) / 1000).toFixed(1)}: Retrieving ARIs from ARI DB...`);
    const allAris = await ariUtils.getAllARIs();
    console.log(`${((performance.now() - startTime) / 1000).toFixed(1)}: Finished retrieving ARIs.`);

    // Filter to only include archived ARIs, and those that are in participating departments if specified.
    let arisToUse: I.ARIQuestion[];

    if (allDepartments) {
        arisToUse = allAris;
    } else {
        const participatingDepartmentNames = await ariUtils.getParticipatingDepartmentNames();
        arisToUse = allAris.filter((ari) => participatingDepartmentNames.includes(ari.department.toLowerCase()));
    }

    console.log('Processing ARIs...');
    let updatedCount = 0;
    const notFound = new Set<number>();

    for (const ari of arisToUse) {
        const existingAri = await client.prisma.publication.findFirst({
            where: {
                externalId: ari.questionId.toString(),
                externalSource: 'ARI'
            }
        });

        if (!existingAri) {
            notFound.add(ari.questionId);
            continue;
        }

        if (!existingAri.archived === ari.isArchived) {
            updatedCount++;

            if (!dryRun) {
                await client.prisma.publication.update({
                    where: { id: existingAri.id },
                    data: { archived: ari.isArchived }
                });
            }
        }
    }

    if (updatedCount) {
        console.log(`Updated archival status of ${updatedCount} publications.`);
    }

    const endTime = performance.now();
    const durationSeconds = Math.round((endTime - startTime) / 100) / 10;

    // Write report file.
    await ariUtils.archivedCheckReport(reportFormat, {
        durationSeconds,
        updatedCount,
        dryRun,
        notFound: Array.from(notFound)
    });

    return `${dryRun ? 'Dry run' : 'Real run'} finished in ${durationSeconds} seconds.`;
};

const triggerScriptECSTask = (commandParts: string[]) =>
    ecs.runFargateTask({
        clusterArn: Helpers.checkEnvVariable('ECS_CLUSTER_ARN'),
        containerOverride: {
            command: commandParts,
            name: 'script-runner'
        },
        securityGroups: [Helpers.checkEnvVariable('ECS_TASK_SECURITY_GROUP_ID')],
        subnetIds: Helpers.checkEnvVariable('PRIVATE_SUBNET_IDS').split(','),
        taskDefinitionId: Helpers.checkEnvVariable('ECS_TASK_DEFINITION_ID')
    });

export const triggerAriIngest = async (dryRun?: boolean): Promise<string> => {
    if (process.env.STAGE !== 'local') {
        // If not local, trigger task to run in ECS.
        const commandParts = [
            'npm',
            'run',
            'ariImport',
            '--',
            ...(dryRun ? ['dryRun=true'] : []),
            'reportFormat=email'
        ];
        await triggerScriptECSTask(commandParts);

        return 'Task triggered.';
    } else {
        // If local, just run the ingest directly.
        return await incrementalAriIngest(!!dryRun, 'file');
    }
};

export const triggerAriArchivedCheck = async (dryRun?: boolean): Promise<string> => {
    if (process.env.STAGE !== 'local') {
        // If not local, trigger task to run in ECS.
        const commandParts = [
            'npm',
            'run',
            'ariArchivedCheck',
            '--',
            ...(dryRun ? ['dryRun=true'] : []),
            'reportFormat=email'
        ];
        await triggerScriptECSTask(commandParts);

        return 'Task triggered.';
    } else {
        // If local, just run the archived check directly.
        return await checkArchivedARIs(false, !!dryRun, 'file');
    }
};
