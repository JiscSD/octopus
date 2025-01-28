import axios from 'axios';
import * as ariUtils from 'integration/ariUtils';
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

export const triggerAriIngest = async (dryRun?: boolean): Promise<string> => {
    if (process.env.STAGE !== 'local') {
        // If not local, trigger task to run in ECS.
        await ecs.runFargateTask({
            clusterArn: Helpers.checkEnvVariable('ECS_CLUSTER_ARN'),
            ...(dryRun && {
                containerOverride: {
                    command: ['npm', 'run', 'ariImport', '--', 'dryRun=true', 'reportFormat=email'],
                    name: 'ari-import'
                }
            }),
            securityGroups: [Helpers.checkEnvVariable('ECS_TASK_SECURITY_GROUP_ID')],
            subnetIds: Helpers.checkEnvVariable('PRIVATE_SUBNET_IDS').split(','),
            taskDefinitionId: Helpers.checkEnvVariable('ECS_TASK_DEFINITION_ID')
        });

        return 'Task triggered.';
    } else {
        // If local, just run the ingest directly.
        return await incrementalAriIngest(!!dryRun, 'file');
    }
};
