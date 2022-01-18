const publicationStatusSeeds = [
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
    }
];

export default publicationStatusSeeds;
