import * as client from 'lib/client';
import * as topicService from 'topic/service';

const deleteHighLevelTopicBookmarks = async (): Promise<number> => {
    const topicBookmarks = await client.prisma.bookmark.findMany({
        where: {
            type: 'TOPIC'
        },
        select: {
            id: true,
            entityId: true
        }
    });

    let deletedBookmarksCount = 0;

    const processedEntityIds: string[] = [];

    for (const bookmark of topicBookmarks) {
        // continue if the bookmarks against this topic were already processed
        if (processedEntityIds.includes(bookmark.entityId)) {
            continue;
        }

        // get the topic
        const topic = await topicService.get(bookmark.entityId);

        if (!topic) {
            continue;
        }

        // check if this is the god topic
        if (!topic.parents.length) {
            // delete all bookmarks against this topic
            const deletedBookmarks = await client.prisma.bookmark.deleteMany({
                where: {
                    entityId: bookmark.entityId
                }
            });

            deletedBookmarksCount += deletedBookmarks.count;
        }

        // check if the parent of this topic is the god topic
        if (topic.parents.length === 1) {
            const parentTopic = await topicService.get(topic.parents[0].id);

            if (parentTopic && !parentTopic.parents.length) {
                // delete all bookmarks against this topic
                const deletedBookmarks = await client.prisma.bookmark.deleteMany({
                    where: {
                        entityId: bookmark.entityId
                    }
                });

                deletedBookmarksCount += deletedBookmarks.count;
            }
        }

        processedEntityIds.push(bookmark.entityId);
    }

    return deletedBookmarksCount;
};

deleteHighLevelTopicBookmarks()
    .then((deletedBookmarksCount) =>
        console.log(`Successfully deleted ${deletedBookmarksCount} bookmarks against high level topics.`)
    )
    .catch((error) => console.log(error));
