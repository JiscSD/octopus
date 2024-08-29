import axios from 'axios';
import * as ariUtils from 'lib/integrations/ariUtils';

/**
 * Incremental ARI ingest.
 * Paginates through ARI questions from the ARI DB API and handles incoming ARIs.
 * If it encounters MAX_UNCHANGED_STREAK ARIs in a row not requiring changes, it stops.
 */
export const incrementalAriIngest = async (): Promise<void> => {
    // Count sequential unchanged ARIs so that we can stop when the streak hits MAX_UNCHANGED_STREAK.
    const MAX_UNCHANGED_STREAK = 5;
    let unchangedStreak = 0;

    // Pagination loop.
    let pageUrl = ariUtils.ariEndpoint;
    let paginationInfo;
    let writeCount = 0;

    do {
        // Get page.
        const response = await axios.get(pageUrl);
        const pageAris = response.data.data;

        for (const pageAri of pageAris) {
            if (!pageAri.isArchived) {
                // Create, update, or skip this ARI as appropriate.
                const handle = await ariUtils.handleIncomingARI(pageAri);

                if (!handle.success) {
                    console.log(`Error when handling ARI with question ID ${pageAri.questionId}: ${handle.message}`);
                } else if (handle.actionTaken === 'none') {
                    // Success is true and actionTaken is none so there were no changes found.
                    unchangedStreak++;

                    if (unchangedStreak >= MAX_UNCHANGED_STREAK) {
                        break;
                    }
                } else {
                    // This was not a skip so reset unchangedStreak counter.
                    unchangedStreak = 0;
                    // Log action taken.
                    console.log(`ARI ${pageAri.questionId} handled successfully with action: ${handle.actionTaken}`);
                    writeCount++;
                    // Artificial delay to avoid hitting datacite rate limits with publication creates/updates.
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
        }

        // Get the next page URL.
        // On the last run this will be undefined but that's fine because we won't need to repeat the loop.
        paginationInfo = response.data.meta.pagination;
        pageUrl = paginationInfo.links.next;
    } while (pageUrl && unchangedStreak < MAX_UNCHANGED_STREAK);

    console.log(`Update complete. Updated ${writeCount} publication${writeCount !== 1 ? 's' : ''}.`);
};
