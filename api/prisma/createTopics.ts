// Create topics provided in an input file.
// Topics must have a parent. This could be another topic from the input file.
// In which case, the child topic must be created after the parent one, so we need to keep track of the IDs
// of topics we create during this process so we can refer to them later.
import * as client from '../src/lib/client';
import * as fs from 'fs';

type CreateTopicData = {
    creationId: string;
    title: string;
    prodExistingParentId1?: string;
    intExistingParentId1?: string;
    prodExistingParentId2?: string;
    intExistingParentId2?: string;
    newParentCreationId1?: string;
    newParentCreationId2?: string;
    multipleParents: boolean;
};

const readDataFromFile = (): { data: CreateTopicData[]; error?: string } => {
    const inputFileName = 'prisma/createTopics.json';

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

const validateData = (data: CreateTopicData[]): { valid: boolean; messages: string[] } => {
    let valid = true;
    const messages: string[] = [];

    for (const item of data) {
        // Check that we have enough fields to link to parents
        if (item.multipleParents) {
            // One of the following combinations must be true to be valid
            if (
                !(
                    // Both parents are also in this data
                    (
                        (item.newParentCreationId1 && item.newParentCreationId2) ||
                        // Both parents already exist prior to running the script
                        (item.intExistingParentId1 &&
                            item.intExistingParentId2 &&
                            item.prodExistingParentId1 &&
                            item.prodExistingParentId2) ||
                        // One parent already exists, one is also in this data
                        (item.newParentCreationId1 && item.intExistingParentId1 && item.prodExistingParentId1)
                    )
                )
            ) {
                valid = false;
                messages.push(
                    `Creation ID ${item.creationId} should have multiple parents but insufficient IDs supplied`
                );
            }
        } else {
            if (!(item.newParentCreationId1 || (item.intExistingParentId1 && item.prodExistingParentId1))) {
                valid = false;
                messages.push(`Creation ID ${item.creationId} does not have parent ID(s) specified`);
            }
        }

        // Check that creation ID of new parents exists in data
        if (
            item.newParentCreationId1 &&
            !data.find((potentialParent) => potentialParent.creationId === item.newParentCreationId1)
        ) {
            valid = false;
            messages.push(`Creation ID ${item.creationId} has an invalid new parent creation ID 1`);
        }

        if (
            item.newParentCreationId2 &&
            !data.find((potentialParent) => potentialParent.creationId === item.newParentCreationId2)
        ) {
            valid = false;
            messages.push(`Creation ID ${item.creationId} has an invalid new parent creation ID 2`);
        }
    }

    return {
        valid,
        messages
    };
};

type CreatedTopics = {
    [creationId: number]: {
        dbId: string;
        parentDbIds: string[];
    };
};

// Called recursively to process a set of topics to be created. If a topic has a parent in the dataset that isn't created
// yet, its creation is deferred and this information is returned so that the function can be re-run over the deferred entries.
const createOrDeferTopics = async (
    data: CreateTopicData[],
    created: CreatedTopics,
    environment: 'int' | 'prod' = 'int',
    dryRun?: boolean
): Promise<{
    created: CreatedTopics;
    deferred: CreateTopicData[];
}> => {
    // Topics that depend on another topic in the data. Will be processed on the next pass through.
    const deferred: CreateTopicData[] = [];

    for (const topic of data) {
        // If topic has a parent we haven't created yet...
        if (
            (topic.newParentCreationId1 && !created[topic.newParentCreationId1]) ||
            (topic.newParentCreationId2 && !created[topic.newParentCreationId2])
        ) {
            // Defer its creation.
            deferred.push(topic);
        } else {
            // Otherwise, create it and keep track of its ID in the database.

            // Work out parent IDs.
            const existingParentId1 = topic[`${environment}ExistingParentId1`];
            const existingParentId2 = topic[`${environment}ExistingParentId2`];
            let parentIds: string[] = [];

            // Multiple parents
            if (topic.multipleParents) {
                // 2 Existing parents
                if (existingParentId1 && existingParentId2) {
                    parentIds = [existingParentId1, existingParentId2];
                }
                // 2 new parents
                else if (topic.newParentCreationId1 && topic.newParentCreationId2) {
                    parentIds = [created[topic.newParentCreationId1].dbId, created[topic.newParentCreationId2].dbId];
                }
                // One of each
                else if (existingParentId1 && topic.newParentCreationId1) {
                    parentIds = [existingParentId1, created[topic.newParentCreationId1].dbId];
                }
            } else {
                // Existing parent
                if (existingParentId1) {
                    parentIds = [existingParentId1];
                }

                // New parent
                if (topic.newParentCreationId1) {
                    parentIds = [created[topic.newParentCreationId1].dbId];
                }
            }

            let createdTopic;

            if (!dryRun) {
                try {
                    createdTopic = await client.prisma.topic.create({
                        data: {
                            title: topic.title,
                            parents: {
                                connect: parentIds.map((parentId) => ({ id: parentId }))
                            }
                        },
                        select: {
                            id: true,
                            parents: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    });
                } catch (err) {
                    console.log(err);
                } finally {
                    created[topic.creationId] = {
                        dbId: createdTopic.id,
                        parentDbIds: parentIds
                    };
                }
            } else {
                created[topic.creationId] = {
                    dbId: 'localtopic' + topic.creationId,
                    parentDbIds: parentIds
                };
            }
        }
    }

    return {
        created,
        deferred
    };
};

const createTopics = async (
    data: CreateTopicData[],
    environment: 'int' | 'prod' = 'int',
    dryRun?: boolean
): Promise<CreatedTopics> => {
    let { created, deferred } = await createOrDeferTopics(data, {}, environment, dryRun);
    console.log(
        `First run complete; deferred ${deferred.length} topics and created ${Object.keys(created).length} topics.`
    );
    const maxRuns = 5;
    let runCount = 1;

    while (deferred.length && runCount < maxRuns) {
        const result = await createOrDeferTopics(deferred, created, environment, dryRun);
        runCount++;
        deferred = result.deferred;
        created = result.created;
        console.log(
            `Recursive run complete; deferred ${deferred.length} topics and have now created ${
                Object.keys(created).length
            } topics.`
        );
    }

    return created;
};

const readFile = readDataFromFile();
const validate = validateData(readFile.data);

if (validate.valid) {
    createTopics(readFile.data, 'int', true)
        .then((result) =>
            console.log(`Finished. Created ${Object.keys(result).length} topics out of ${readFile.data.length}.`)
        )
        .catch((err) => console.log(err));
}
