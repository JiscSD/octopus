import * as dotenv from 'dotenv';

// Important to do this so that environment variables are treated the same as in deployed code.
dotenv.config();

import * as ariUtils from 'integration/ariUtils';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as integrationService from 'integration/service';

/**
 * Can take the following arguments:
 *  - allDepartments: If "true", the script will run for all departments,
 *    rather than just the ones specified in the PARTICIPATING_ARI_USER_IDS environment variable.
 *    - Has no effect unless "full" is "true".
 *    - Default: false
 *  - dryRun: If "true", the script will not actually create or update any publications,
 *    and instead report on what it would have done.
 *    - Default: false
 *  - full: If "true", the script will import all ARIs from the ARI DB, instead of stopping when it
 *    thinks it has found all the new ones (the incremental way).
 *    - Default: false
 *  - reportFormat: Controls how the output of the job is reported. Can be "email" or "file". Emails
 *    are sent to the addresses listed in the INGEST_REPORT_RECIPIENTS environment variable. Files are
 *    written to "ari-import-report.txt".
 *    - Default: "file"
 *
 * e.g.:
 * npm run ariImport -- allDepartments=true full=true
 */
const parseArguments = (): {
    importAllDepartments: boolean;
    dryRun: boolean;
    full: boolean;
    reportFormat: I.IngestReportFormat;
} => {
    const args = Helpers.parseNpmScriptArgs();

    for (const arg of Object.keys(args)) {
        if (!['allDepartments', 'dryRun', 'full', 'reportFormat'].includes(arg)) {
            throw new Error(`Unexpected argument: ${arg}`);
        }
    }

    const { allDepartments: allDepartmentsArg, dryRun: dryRunArg, full: fullArg, reportFormat: reportFormatArg } = args;

    for (const arg of [allDepartmentsArg, dryRunArg, fullArg]) {
        Helpers.checkBooleanArgValue(arg);
    }

    if (reportFormatArg && !(reportFormatArg === 'email' || reportFormatArg === 'file')) {
        throw new Error(`"reportFormat" must be "email" or "file"`);
    }

    return {
        importAllDepartments: allDepartmentsArg === 'true',
        dryRun: dryRunArg === 'true',
        full: fullArg === 'true',
        reportFormat: reportFormatArg ? (reportFormatArg as I.IngestReportFormat) : 'file'
    };
};

/**
 * Full ARI ingest.
 * Differs from incremental ingest by fetching all ARIs before processing them.
 * It will not stop until all ARIs have been processed.
 */
export const fullAriIngest = async (
    allDepartments: boolean,
    dryRun: boolean,
    reportFormat: I.IngestReportFormat
): Promise<string> => {
    const startTime = performance.now();

    console.log(`${((performance.now() - startTime) / 1000).toFixed(1)}: Retrieving ARIs from ARI DB...`);

    const allAris = await ariUtils.getAllARIs();

    console.log(`${((performance.now() - startTime) / 1000).toFixed(1)}: Finished retrieving ARIs.`);

    // Filter out archived ARIs and those not in the participating departments (if desired).
    const participatingDepartmentNames = await ariUtils.getParticipatingDepartmentNames();
    const aris = allAris.filter(
        (ari) =>
            !ari.isArchived && (allDepartments || participatingDepartmentNames.includes(ari.department.toLowerCase()))
    );

    // Process all the ARIs.
    console.log('Processing ARIs...');
    const failed: I.HandledARI[] = [];
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const unrecognisedDepartments = new Set<string>();
    const unrecognisedTopics = new Set<string>();

    for (const ari of aris) {
        const handleAri = await ariUtils.handleIncomingARI(ari, dryRun);

        if (handleAri.unrecognisedDepartment) {
            unrecognisedDepartments.add(handleAri.unrecognisedDepartment);
        }

        if (handleAri.unrecognisedTopics) {
            handleAri.unrecognisedTopics.forEach((topic) => unrecognisedTopics.add(topic));
        }

        if (handleAri.success) {
            switch (handleAri.actionTaken) {
                case 'create':
                    createdCount++;

                    // Datacite test has a firewall that only 750 request per IP across a 5 minute period.
                    // https://support.datacite.org/docs/is-there-a-rate-limit-for-making-requests-against-the-datacite-apis
                    // 5 minutes = 300 seconds. 300 / 750 = 0.4 seconds per request, so we take minimum 0.5s per hit to be safe.
                    // We hit datacite twice when creating an ARI, so wait 1 second.
                    if (!dryRun) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }

                    break;
                case 'update':
                    updatedCount++;

                    // We hit datacite once when updating an ARI in place, so wait half a second.
                    if (!dryRun) {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                    }

                    break;
                case 'none':
                    skippedCount++;
                    break;
            }
        } else {
            failed.push(handleAri);
        }
    }

    if (createdCount) {
        console.log(`${createdCount} were created as new publications.`);
    }

    if (updatedCount) {
        console.log(`${updatedCount} triggered updates to existing publications.`);
    }

    if (skippedCount) {
        console.log(
            `${skippedCount} were skipped because they were found to exist in octopus and no changes were detected.`
        );
    }

    if (failed.length) {
        console.log(`${failed.length} encountered some sort of issue and failed. Please check the report for details.`);
    }

    const endTime = performance.now();
    const durationSeconds = Math.round((endTime - startTime) / 100) / 10;

    // Write report file.
    await ariUtils.ingestReport(reportFormat, {
        checkedCount: aris.length,
        durationSeconds,
        createdCount,
        updatedCount,
        unrecognisedDepartments: Array.from(unrecognisedDepartments).sort(),
        unrecognisedTopics: Array.from(unrecognisedTopics).sort(),
        dryRun,
        full: true
    });

    return `${dryRun ? 'Dry run' : 'Real run'} finished. Successfully handled ${aris.length - failed.length} of ${
        aris.length
    } ARIs in ${durationSeconds} seconds.`;
};

const ariImport = async (
    allDepartments: boolean,
    dryRun: boolean,
    full: boolean,
    reportFormat: I.IngestReportFormat
): Promise<string> => {
    if (!full) {
        return await integrationService.incrementalAriIngest(dryRun, reportFormat);
    } else {
        return await fullAriIngest(allDepartments, dryRun, reportFormat);
    }
};

const { importAllDepartments, dryRun, full, reportFormat } = parseArguments();

ariImport(importAllDepartments, dryRun, full, reportFormat)
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
