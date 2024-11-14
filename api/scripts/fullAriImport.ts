import axios from 'axios';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

// Important to do this so that environment variables are treated the same as in deployed code.
expand(dotenv.config());

import * as ariUtils from 'integration/ariUtils';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

// Can take an argument to run for all departments, rather than just the ones specified in the
// PARTICIPATING_ARI_USER_IDS environment variable.
// npm run fullAriImport -- allDepartments=true
const parseArguments = (): { allDepartments: boolean } => {
    const args = Helpers.parseNpmScriptArgs();

    for (const arg of Object.keys(args)) {
        if (!['allDepartments'].includes(arg)) {
            throw new Error(`Unexpected argument: ${arg}`);
        }
    }

    const allDepartmentsArg = args.allDepartments;

    if (allDepartmentsArg && !(allDepartmentsArg === 'true' || allDepartmentsArg === 'false')) {
        throw new Error('allDepartments must be "true" or "false"');
    }

    return {
        allDepartments: !!allDepartmentsArg
    };
};

const fullAriImport = async (allDepartments?: boolean): Promise<string> => {
    const startTime = performance.now();

    // Collect all ARIs in a variable.
    const allAris: I.ARIQuestion[] = [];

    // After a page has been retrieved, add the data to the aris variable,
    // get the next page and repeat until reaching the last page.
    let pageUrl = ariUtils.ariEndpoint;
    // Updates with each loop. Contains total count which we need outside the loop.
    let paginationInfo;

    console.log(`${((performance.now() - startTime) / 1000).toFixed(1)}: Retrieving ARIs from ARI DB...`);

    do {
        // Get page.
        const response = await axios.get(pageUrl);
        const pageAris = response.data.data;

        // Add page's ARIs to our variable.
        allAris.push(...pageAris);

        // Get the next page URL.
        // On the last run this will be undefined but that's fine because we won't need to repeat the loop.
        paginationInfo = response.data.meta.pagination;
        pageUrl = paginationInfo.links.next;
    } while (pageUrl);

    console.log(`${((performance.now() - startTime) / 1000).toFixed(1)}: Finished retrieving ARIs.`);

    // In case something has caused this process to fail, perhaps the API changed, etc...
    if (allAris.length !== paginationInfo.total) {
        throw new Error('Number of ARIs retrieved does not match reported total. Stopping.');
    }

    // Determine which departments are having their ARIs imported.
    const participatingDepartmentNames = await ariUtils.getParticipatingDepartmentNames();

    // Remove archived ARIs and ARIs from departments we are not importing.
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

    for (const ari of aris) {
        const handleAri = await ariUtils.handleIncomingARI(ari);

        if (handleAri.success) {
            switch (handleAri.actionTaken) {
                case 'create':
                    createdCount++;
                    // Datacite test has a firewall that only 750 request per IP across a 5 minute period.
                    // https://support.datacite.org/docs/is-there-a-rate-limit-for-making-requests-against-the-datacite-apis
                    // 5 minutes = 300 seconds. 300 / 750 = 0.4 seconds per request, so we take minimum 0.5s per hit to be safe.
                    // We hit datacite twice when creating an ARI, so wait 1 second.
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    break;
                case 'update':
                    updatedCount++;
                    // We hit datacite once when updating an ARI in place, so wait half a second.
                    await new Promise((resolve) => setTimeout(resolve, 500));
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
        console.log(`${failed.length} encountered some sort of issue and failed:`, failed);
    }

    const endTime = performance.now();

    return `Finished. Successfully handled ${aris.length - failed.length} of ${aris.length} ARIs in ${(
        (endTime - startTime) /
        1000
    ).toFixed(1)} seconds.`;
};

const { allDepartments } = parseArguments();

fullAriImport(allDepartments)
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
