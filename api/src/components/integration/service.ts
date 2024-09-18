import axios from 'axios';
import * as ariUtils from 'lib/integration/ariUtils';
import * as email from 'lib/email';

/**
 * Incremental ARI ingest.
 * Paginates through ARI questions from the ARI DB API and handles incoming ARIs.
 * If it encounters MAX_UNCHANGED_STREAK ARIs in a row not requiring changes, it stops.
 */
export const incrementalAriIngest = async (): Promise<string> => {
    const start = new Date();
    // Count sequential unchanged ARIs so that we can stop when the streak hits MAX_UNCHANGED_STREAK.
    const MAX_UNCHANGED_STREAK = 5;
    let unchangedStreak = 0;

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
            if (!pageAri.isArchived) {
                // Create, update, or skip this ARI as appropriate.
                const handle = await ariUtils.handleIncomingARI(pageAri);
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

                    if (unchangedStreak >= MAX_UNCHANGED_STREAK) {
                        break;
                    }
                } else {
                    // This was not a skip so reset unchangedStreak counter.
                    unchangedStreak = 0;
                    // Log action taken.
                    console.log(`ARI ${pageAri.questionId} handled successfully with action: ${handle.actionTaken}`);

                    if (handle.actionTaken === 'create') {
                        createdCount++;
                        // Artificial delay to avoid hitting datacite rate limits with publication creates/updates.
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    } else if (handle.actionTaken === 'update') {
                        updatedCount++;
                        await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                }
            }
        }

        // Get the next page URL.
        // On the last run this will be undefined but that's fine because we won't need to repeat the loop.
        paginationInfo = response.data.meta.pagination;
        pageUrl = paginationInfo.links.next;
    } while (pageUrl && unchangedStreak < MAX_UNCHANGED_STREAK);

    const end = new Date();
    // Get duration in seconds to the nearest 1st decimal place.
    const durationSeconds = Math.round((end.getTime() - start.getTime()) / 100) / 10;
    await email.incrementalAriIngestReport({
        checkedCount,
        durationSeconds,
        createdCount,
        updatedCount,
        unrecognisedDepartments: Array.from(unrecognisedDepartments).sort(),
        unrecognisedTopics: Array.from(unrecognisedTopics).sort()
    });

    const writeCount = createdCount + updatedCount;

    return `Update complete. Updated ${writeCount} publication${writeCount !== 1 ? 's' : ''}.`;
};
