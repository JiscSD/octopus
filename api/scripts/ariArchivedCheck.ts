import * as dotenv from 'dotenv';
dotenv.config();

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

const { importAllDepartments, dryRun, reportFormat } = parseArguments();

integrationService
    .checkArchivedARIs(importAllDepartments, dryRun, reportFormat)
    .then((message) => console.log(message))
    .catch((err) => console.error('Error during ARI archived check:', err));
