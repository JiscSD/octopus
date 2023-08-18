import * as I from 'interface';

const bookmarkSeeds: {
    id: string;
    type: I.BookmarkType;
    entityId: string;
    userId: string;
}[] = [
    {
        id: 'bookmark-1',
        type: 'PUBLICATION',
        entityId: 'publication-problem-live',
        userId: 'test-user-2'
    },
    {
        id: 'bookmark-2',
        type: 'PUBLICATION',
        entityId: 'publication-hypothesis-live',
        userId: 'test-user-3'
    },
    {
        id: 'bookmark-3',
        type: 'PUBLICATION',
        entityId: 'publication-real-world-application-live',
        userId: 'test-user-3'
    },
    {
        id: 'bookmark-4',
        type: 'TOPIC',
        entityId: 'test-topic-1',
        userId: 'test-user-2'
    },
    {
        id: 'bookmark-5',
        type: 'TOPIC',
        entityId: 'test-topic-1a',
        userId: 'test-user-2'
    }
];

export default bookmarkSeeds;
