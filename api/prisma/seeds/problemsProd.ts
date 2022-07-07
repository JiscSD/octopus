const problems = [
    {
        id: 'why',
        doi: '10.57874/why',
        title: 'What makes everything we can detect in the universe around us the way that it is, and why?',
        type: 'PROBLEM',
        content: 'What makes everything we can detect in the universe around us the way that it is, and why?',
        user: { connect: { id: 'octopus' } },
        publicationStatus: {
            create: [
                { status: 'DRAFT', createdAt: '2022-07-07T11:00:00.000Z' },
                { status: 'LIVE', createdAt: '2022-07-07T11:00:00.000Z' }
            ]
        }
    },
];

export default problems;
