import * as client from '../src/lib/client';

// Goes through all the links in the system without a versionToId value and sets it to the
// latest live version of the publication that has been linked to.
// This is a required step before we can run the migration that makes the field mandatory.
const setLinkToVersions = async (): Promise<string> => {
    const linksWithoutToVersion = await client.prisma.links.findMany({
        where: {
            versionToId: null
        }
    });

    let updatedCount = 0;

    for (const link of linksWithoutToVersion) {
        const latestToVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: link.publicationToId,
                isLatestLiveVersion: true
            }
        });

        if (latestToVersion) {
            await client.prisma.links.update({
                where: {
                    id: link.id
                },
                data: {
                    versionToId: latestToVersion.id
                }
            });
            updatedCount++;
        } else {
            console.log(`Failed to find a latest version for link ${link.id}.`);
        }
    }

    return updatedCount === linksWithoutToVersion.length
        ? 'Success'
        : `Failed to update ${linksWithoutToVersion.length - updatedCount} links. Please investigate.`;
};

setLinkToVersions()
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
