import * as client from 'lib/client';

/**
 *
 * Update "draft" column for existing LIVE publications
 * Currently each publication has a v1 which can be LIVE or DRAFT
 */
const updateDraftLinks = async (): Promise<number> => {
    const updatedLinks = await client.prisma.links.updateMany({
        where: {
            publicationFromRef: {
                versions: {
                    every: {
                        currentStatus: 'LIVE'
                    }
                }
            }
        },
        data: {
            draft: false
        }
    });

    return updatedLinks.count;
};

updateDraftLinks()
    .then((updatedLinksCount) => console.log(`Successfully updated "draft" column for ${updatedLinksCount} links.`))
    .catch((err) => console.log(err));
