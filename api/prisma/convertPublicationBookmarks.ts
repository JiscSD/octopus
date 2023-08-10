import * as I from '../src/lib/interface';
import * as client from '../src/lib/client';

const convertPublicationBookmarks = async (): Promise<number> => {
    // Get all old-style publication bookmarks
    const oldBookmarks = await client.prisma.publicationBookmarks.findMany();
    // Prepare objects to insert as new bookmarks
    const bookmarksToCreate = oldBookmarks.map(oldBookmark => (
        {
            type: 'PUBLICATION' as I.BookmarkType,
            userId: oldBookmark.userId,
            entityId: oldBookmark.publicationId
        }
    ));
    // Create new bookmarks
    const create = await client.prisma.bookmark.createMany({
        data: bookmarksToCreate
    });

    // If we have created as many bookmarks as we expected, delete old bookmarks
    if (create.count === oldBookmarks.length) {
        await client.prisma.publicationBookmarks.deleteMany();
    } else {
        throw new Error("Failed to convert all bookmarks. Skipping deletion step.");
    }

    return create.count;
};

convertPublicationBookmarks().then((count) => console.log(`Converted ${count} bookmarks.`)).catch(error => console.log(error));