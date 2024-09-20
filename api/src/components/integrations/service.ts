import axios from 'axios';
import * as ariUtils from 'lib/integrations/ariUtils';
import * as ingestLogService from 'ingestLog/service';

/**
 * Incremental ARI ingest.
 * Paginates through ARI questions from the ARI DB API and handles incoming ARIs.
 * It stops when both of the following conditions are true:
 *   - It encounters MAX_UNCHANGED_STREAK ARIs in a row not requiring changes.
 *   - It encounters an ARI with dateUpdated before the start time of the most
 *       recent successful ingest (if this start time is available).
 */
export const incrementalAriIngest = async (): Promise<void> => {
    const MAX_UNCHANGED_STREAK = 5;
    // Get most start time of last successful run to help us know when to stop.
    const mostRecentStart = await ingestLogService.getMostRecentStartTime('ARI');

    if (!mostRecentStart) {
        console.log(
            `Unable to get most recent start time. This job will stop when it encounters ${MAX_UNCHANGED_STREAK} unchanged ARIs, regardless of their dateUpdated value.`
        );
    }

    // Log start time.
    const log = await ingestLogService.create('ARI');

    // Count sequential unchanged ARIs so that we can stop when the streak hits MAX_UNCHANGED_STREAK.
    let unchangedStreak = 0;

    // Track whether we have passed the last successful import start time.
    let timeOverlap = false;

    // Pagination loop.
    let pageUrl = ariUtils.ariEndpoint;
    let paginationInfo;
    let writeCount = 0;

    do {
        // Get page.
        const response = await axios.get(pageUrl);
        const pageAris = response.data.data;

        for (const pageAri of pageAris) {
            if (mostRecentStart && new Date(pageAri.dateUpdated) < new Date(mostRecentStart) && !timeOverlap) {
                timeOverlap = true;
                console.log('Time overlap - reached an ARI older than the most recent ingest start time.');
            }

            if (!pageAri.isArchived) {
                // Create, update, or skip this ARI as appropriate.
                const handle = await ariUtils.handleIncomingARI(pageAri);

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
                    // Log action taken.
                    console.log(`ARI ${pageAri.questionId} handled successfully with action: ${handle.actionTaken}`);
                    writeCount++;

                    // Artificial delay to avoid hitting datacite rate limits with publication creates/updates.
                    // https://support.datacite.org/docs/is-there-a-rate-limit-for-making-requests-against-the-datacite-apis
                    if (handle.actionTaken === 'create') {
                        // Datacite is hit twice, to initialise DOI and get publication ID, then update DOI with data.
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }

                    if (handle.actionTaken === 'update') {
                        // Datacite is hit once, to update the DOI with changes.
                        await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                }
            }
        }

        // Get the next page URL.
        // On the last run this will be undefined but that's fine because we won't need to repeat the loop.
        paginationInfo = response.data.meta.pagination;
        pageUrl = paginationInfo.links.next;
    } while (pageUrl && unchangedStreak < MAX_UNCHANGED_STREAK && !timeOverlap);

    // Log end time.
    await ingestLogService.setEndTime(log.id, new Date());
    console.log(`Update complete. Updated ${writeCount} publication${writeCount !== 1 ? 's' : ''}.`);
};
