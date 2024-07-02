import * as client from '../src/lib/client';
import * as fs from 'fs';

type CreateTopicMappingData = {
    ARIName: string;
    topicExists: boolean;
    octopusTopic: string;
    newTopicId: string;
    intExistingTopicId: string;
    prodExistingTopicId: string;
    isMapped: boolean;
};

const readDataFromFile = (): { data: CreateTopicMappingData[]; error?: string } => {
    const inputFileName = 'prisma/topic-mappings.json';

    if (!fs.existsSync(inputFileName)) {
        return {
            data: [],
            error: `Input file "${inputFileName}" not found.`
        };
    }

    const fileData = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));

    return {
        data: fileData
    };
};

type Environment = 'int' | 'prod';

const validateData = async (
    data: CreateTopicMappingData[],
    environment: Environment = 'int'
): Promise<{ valid: boolean; messages: string[] }> => {
    let valid = true;
    const messages: string[] = [];

    // Ensure names are unique
    const uniqueNames = new Set();
    const duplicateNames: string[] = [];

    for (const item of data) {
        const name = item.ARIName;

        if (uniqueNames.has(name)) {
            duplicateNames.push(name);
        } else {
            uniqueNames.add(name);
        }

        if (item.isMapped) {
            // If topic is said to exist, check if we have an ID and it actually exists.
            if (item.topicExists) {
                if (!(item.intExistingTopicId && item.prodExistingTopicId)) {
                    valid = false;
                    messages.push(
                        `ARI topic ${item.ARIName} is supposed to exist but does not have existing IDs provided for both environments.`
                    );
                }

                // Check DB for existing topic
                const existingTopic = await client.prisma.topic.findUnique({
                    where: {
                        id: item[`${environment}ExistingTopicId`]
                    }
                });

                if (!existingTopic) {
                    valid = false;
                    messages.push(
                        `ARI topic ${item.ARIName} has a specified existing topic to map to but it could not be found in the database.`
                    );
                }
            } else {
                // If topic is not said to exist, check if a new topic ID is provided.
                if (!item.newTopicId) {
                    valid = false;
                    messages.push(
                        `ARI topic ${item.ARIName} has a specified new topic to map to but a new topic creation ID was not provided.`
                    );
                }
            }
        }
    }

    if (duplicateNames.length) {
        valid = false;
        messages.push(`Duplicate names detected: ${duplicateNames.join(', ')}`);
    }

    return {
        valid,
        messages
    };
};

type CreatedTopicMapping = {
    isMapped: boolean;
    title: string;
    topic?: {
        id: string;
        title: string;
    };
};

const createTopicMappings = async (
    data: CreateTopicMappingData[],
    environment: Environment = 'int',
    dryRun?: boolean
): Promise<CreatedTopicMapping[]> => {
    const created: CreatedTopicMapping[] = [];

    for (const mapping of data) {
        // TODO: for now, just run over ones where a topic exists, as the new ones haven't been created yet.
        if (mapping.topicExists) {
            let createdMapping;

            if (!dryRun) {
                try {
                    createdMapping = await client.prisma.topicMapping.create({
                        data: {
                            title: mapping.ARIName,
                            source: 'ARI',
                            ...(mapping.isMapped
                                ? { topicId: mapping[`${environment}ExistingTopicId`] }
                                : { isMapped: false })
                        },
                        select: {
                            isMapped: true,
                            title: true,
                            topic: {
                                select: {
                                    id: true,
                                    title: true
                                }
                            }
                        }
                    });
                } catch (err) {
                    console.log(err);
                } finally {
                    created.push({
                        isMapped: createdMapping.isMapped,
                        title: createdMapping.title,
                        ...(createdMapping.topic && { topic: createdMapping.topic })
                    });
                }
            } else {
                // Push mocked new topic mapping.
                created.push({
                    isMapped: mapping.isMapped,
                    title: mapping.ARIName.toLowerCase(), // prisma client extension lower cases title on save
                    ...(mapping.isMapped && {
                        topic: {
                            id: mapping[`${environment}ExistingTopicId`],
                            title: mapping.octopusTopic
                        }
                    })
                });
            }
        }
    }

    return created;
};

const fileContents = readDataFromFile();

if (fileContents.error) {
    console.log('Read file error: ', fileContents.error);
}

validateData(fileContents.data, 'int')
    .then((result) => {
        if (result.valid) {
            const dryRun = true;
            createTopicMappings(fileContents.data, 'int', dryRun)
                .then((createdMappings) => {
                    console.log(
                        dryRun
                            ? 'Dry run complete.'
                            : 'Real run complete.' +
                                  ` Created ${createdMappings.length} mappings out of ${fileContents.data.length}.`
                    );
                    console.log(createdMappings);
                })
                .catch((err) => console.log(err));
        } else {
            console.log('Failed validation.', result);
        }
    })
    .catch((err) => console.log(err));
