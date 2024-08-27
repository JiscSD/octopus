import axios from 'axios';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

// Important to do this so that environment variables are treated the same as in deployed code.
expand(dotenv.config());

import * as ariUtils from 'lib/integrations/ariUtils';
import * as I from 'interface';

const fullAriImport = async (): Promise<string> => {
    const startTime = performance.now();

    // Collect all ARIs in a variable.
    const allAris: I.ARIQuestion[] = [];

    // After a page has been retrieved, add the data to the aris variable,
    // get the next page and repeat until reaching the last page.
    let pageUrl = 'https://ari.org.uk/api/questions?order_by=dateUpdated';
    // Updates with each loop. Contains total count which we need outside the loop.
    let paginationInfo;

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

    // In case something has caused this process to fail, perhaps the API changed, etc...
    if (allAris.length !== paginationInfo.total) {
        throw new Error('Number of ARIs retrieved does not match reported total. Stopping.');
    }

    // Remove archived aris.
    const aris = allAris.filter((ari) => !ari.isArchived);

    // Process all the ARIs.
    const handledAris: I.HandledARI[] = [];

    for (const ari of aris) {
        const handleAri = await ariUtils.handleIncomingARI(ari);
        handledAris.push(handleAri);

        // Datacite test has a firewall that only 750 request per IP across a 5 minute period.
        // Introducing a delay between each ARI handling (which may hit datacite - twice if creating a publication,
        // or once if reversioning a publication) ensures we won't hit this limit.
        // https://support.datacite.org/docs/is-there-a-rate-limit-for-making-requests-against-the-datacite-apis
        if (handleAri.actionTaken === 'create' || handleAri.actionTaken === 'update') {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    const createdAris = handledAris.filter((handle) => handle.actionTaken === 'create');

    if (createdAris.length !== handledAris.length) {
        console.log('Not every ARI was handled as a new creation!');
        console.log(`${createdAris.length} were created as new publications.`);
        const updatedAris = handledAris.filter((handle) => handle.actionTaken === 'update');
        console.log(`${updatedAris.length} triggered updates to existing publications.`);
        const skippedAris = handledAris.filter((handle) => handle.actionTaken === 'none');
        console.log(
            `${skippedAris.length} were skipped because they were found to exist in octopus and no changes were detected.`
        );
        const failedAris = handledAris.filter((handle) => handle.success === false);
        console.log(`${failedAris.length} encounted some sort of issue and failed:`, failedAris);
    }

    const endTime = performance.now();

    return `Finished. Created ${createdAris.length} publications from ${handledAris.length} ARI questions in ${(
        (endTime - startTime) /
        1000
    ).toFixed(1)} seconds.`;
};

fullAriImport()
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
