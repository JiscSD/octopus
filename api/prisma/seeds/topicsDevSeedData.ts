const topicSeeds = [
    {
        id: 'test-topic-1',
        title: 'Test topic',
        translations: {
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
                },
                {
                    id: 'test-topic-1b',
                    title: 'Test sub-topic B',
                }
            ]
        }
    }
];

export default topicSeeds;