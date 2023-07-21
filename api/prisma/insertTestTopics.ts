import * as client from '../src/lib/client';

const insertTestTopics = async (): Promise<void> => {
    // Insert some topics that can be used for testing.
    await client.prisma.topic.create({
        data: {
            id: "topic-for-testing",
            title: "Topic for testing",
            translations: {
                create: [
                    {
                        language: "fr",
                        value: "Sujet à tester"
                    }
                ]
            },
            children: {
                create: [
                    {
                        id: "subtopic-for-testing",
                        title: "Subtopic for testing",
                        children: {
                            create: [
                                {
                                    id: "subsubtopic-for-testing",
                                    title: "Subsubtopic for testing"
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });
};

insertTestTopics().then(() => console.log('Finished.')).catch(error => console.log(error));