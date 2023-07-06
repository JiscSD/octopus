const topicSeeds = [
    {
        id: 'test-topic-1',
        title: 'Test topic',
        description: 'This is a research topic created to provide authors with a place to attach new problem publications.',
        keywords: ['test', 'topic'],
        alternativeTranslations: {
            create: [
                {
                    language: "fr",
                    value: "Sujet de test"
                },
                {
                    language: "es",
                    value: "Tema de prueba"
                }
            ]
        },
        children: {
            create: [
                {
                    id: 'test-topic-1a',
                    title: 'Test sub-topic A',
                    description: 'This is a research topic created to provide authors with a place to attach new problem publications.',
                },
                {
                    id: 'test-topic-1b',
                    title: 'Test sub-topic B',
                    description: 'This is a research topic created to provide authors with a place to attach new problem publications.',
                }
            ]
        }
    }
];

export default topicSeeds;