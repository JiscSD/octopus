const publicationSeeds = [
    {

        id: 'publication-1',
        title: 'Publication 1',
        type: 'PEER_REVIEW',
        content: 'Publication 1',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: {
                status: 'DRAFT'
            }
        }
    },
    {
        id: 'publication-2',
        title: 'Publication 2',
        type: 'PROBLEM',
        content: 'Publication 2',
        user: {
            connect: {
                id: 'test-user-2'
            }
        },
        publicationStatus: {
            create: {
                status: 'DRAFT'
            }
        }
    }
];

export default publicationSeeds;
