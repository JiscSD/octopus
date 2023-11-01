import * as client from 'lib/client';

/**
 *
 * This script will add topics from publication to the v1
 *
 */
const migrateTopicsFromPubToVersions = async (): Promise<number> => {
    // get all publications with topics
    const publicationsWithTopics = await client.prisma.publication.findMany({
        where: {
            topics: {
                some: {}
            }
        },
        include: {
            topics: true,
            versions: true
        }
    });

    let updatedVersionsCount = 0;

    // update each v1 with topics from the publication
    for (const publicationWithTopics of publicationsWithTopics) {
        const { versions, topics } = publicationWithTopics;
        const version = versions[0];

        await client.prisma.publicationVersion.update({
            where: {
                id: version.id
            },
            data: {
                topics: {
                    set: topics.map((topic) => ({ id: topic.id }))
                }
            }
        });

        updatedVersionsCount += 1;
    }

    return updatedVersionsCount;
};

migrateTopicsFromPubToVersions()
    .then((updatedVersionsCount) => console.log(`Successfully updated ${updatedVersionsCount} versions with topics.`))
    .catch((err) => console.log(err));
