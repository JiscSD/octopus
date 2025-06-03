import * as dotenv from 'dotenv';
dotenv.config();

import * as ariUtils from 'integration/ariUtils';
import * as client from 'lib/client';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

/**
 * Can take the following arguments:
 *  - allDepartments: If "true", the script will run for all departments,
 *    rather than just the ones specified in the PARTICIPATING_ARI_USER_IDS environment variable.
 *    - Has no effect unless "full" is "true".
 *    - Default: false
 *  - dryRun: If "true", the script will not actually create or update any publications,
 *    and instead report on what it would have done.
 *    - Default: false
 *  - reportFormat: Controls how the output of the job is reported. Can be "email" or "file". Emails
 *    are sent to the addresses listed in the INGEST_REPORT_RECIPIENTS environment variable. Files are
 *    written to "ari-import-report.txt".
 *    - Default: "file"
 *
 * e.g.:
 * npm run ariArchivedCheck -- allDepartments=true full=true
 */
const parseArguments = (): {
    importAllDepartments: boolean;
    dryRun: boolean;
    reportFormat: I.IngestReportFormat;
} => {
    const args = Helpers.parseNpmScriptArgs();

    for (const arg of Object.keys(args)) {
        if (!['allDepartments', 'dryRun', 'full', 'reportFormat'].includes(arg)) {
            throw new Error(`Unexpected argument: ${arg}`);
        }
    }

    const { allDepartments: allDepartmentsArg, dryRun: dryRunArg, reportFormat: reportFormatArg } = args;

    for (const arg of [allDepartmentsArg, dryRunArg]) {
        Helpers.checkBooleanArgValue(arg);
    }

    if (reportFormatArg && !(reportFormatArg === 'email' || reportFormatArg === 'file')) {
        throw new Error(`"reportFormat" must be "email" or "file"`);
    }

    return {
        importAllDepartments: allDepartmentsArg === 'true',
        dryRun: dryRunArg === 'true',
        reportFormat: reportFormatArg ? (reportFormatArg as I.IngestReportFormat) : 'file'
    };
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

const { importAllDepartments, dryRun, reportFormat } = parseArguments();

checkArchivedARIs(importAllDepartments, dryRun, reportFormat)
    .then((message) => console.log(message))
    .catch((err) => console.error('Error during ARI archived check:', err));
