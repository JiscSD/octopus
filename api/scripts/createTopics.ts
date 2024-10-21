/**
 * Use this script to import topics from a data file at ./topics.json.
 * The data in that file should match the "CreateTopicData" type in this file.
 *
 * By default, the script will perform a dry run, aiming at the local/int environments.
 * To change this, provide args as follows:
 *
 * npm run createTopics -- environment=prod dryRun=false
 */

import 'dotenv/config';
import * as client from '../src/lib/client';
import * as fs from 'fs';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

type CreateTopicData = {
    // The title of the new topic.
    title: string;
    // The IDs of parent topics in octopus on local/int environments.
    intParentIds: string[];
    // The IDs of parent topics in octopus on the prod environment.
    prodParentIds: string[];
    language?: I.Languages;
    translations?: I.TopicTranslation[];
};

const parseArguments = (): { environment: I.Environment; dryRun: boolean } => {
    const args = Helpers.parseNpmScriptArgs();
    const environmentArg = args.environment;

    if (environmentArg && !(environmentArg === 'int' || environmentArg === 'prod')) {
        throw new Error('Environment must be one of "int" or "prod"');
    }

    const dryRunArg = args.dryRun;

    if (dryRunArg && !(dryRunArg === 'true' || dryRunArg === 'false')) {
        throw new Error('dryRun must be one of "true" or "false"');
    }

    return {
        environment: environmentArg === 'prod' ? 'prod' : 'int',
        dryRun: dryRunArg === 'false' ? false : true
    };
};

const readDataFromFile = (): { data: CreateTopicData[]; error?: string } => {
    const inputFileName = 'scripts/topics.json';

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

const validateData = async (
    data: CreateTopicData[],
    environment: I.Environment = 'int'
): Promise<{ valid: boolean; messages: string[] }> => {
    let valid = true;
    const messages: string[] = [];

    // Ensure names are unique.
    const uniqueNames = new Set();
    const duplicateNames: string[] = [];

    if (!Array.isArray(data)) {
        return {
            valid: false,
            messages: ['Data is not an array.']
        };
    }

    for (const item of data) {
        const name = item.title;

        if (uniqueNames.has(name)) {
            duplicateNames.push(name);
        } else {
            uniqueNames.add(name);
        }

        if (!item.title) {
            valid = false;
            messages.push(`Found topic with no title.`);
        }

        if (!(item.intParentIds?.length && item.prodParentIds?.length)) {
            valid = false;
            messages.push(`Topic "${item.title}" does not have parent IDs provided for both environments.`);
        }

        // Check DB for parents.
        for (const parentId of item[`${environment}ParentIds`]) {
            const existingParent = await client.prisma.topic.findUnique({
                where: {
                    id: parentId
                }
            });

            if (!existingParent) {
                valid = false;
                messages.push(`Parent "${parentId}" for topic "${item.title}" could not be found in the database.`);
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

type CreatedTopic = {
    title: string;
    parents: {
        id: string;
        title: string;
    }[];
    language?: I.Languages;
    translations?: I.TopicTranslation[];
};

const createTopics = async (
    data: CreateTopicData[],
    environment: I.Environment = 'int',
    dryRun?: boolean
): Promise<CreatedTopic[]> => {
    const created: CreatedTopic[] = [];

    for (const topic of data) {
        let createdTopic;

        if (!dryRun) {
            try {
                createdTopic = await client.prisma.topic.create({
                    data: {
                        title: topic.title,
                        language: topic.language,
                        parents: {
                            connect: topic[`${environment}ParentIds`].map((id) => ({ id }))
                        },
                        ...(topic.translations?.length ? { translations: { create: topic.translations } } : {})
                    },
                    select: {
                        title: true,
                        parents: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        language: true,
                        translations: {
                            select: {
                                language: true,
                                value: true
                            }
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            } finally {
                created.push(createdTopic);
            }
        } else {
            // Get parents so user can easily see what would be linked.
            const parents = await client.prisma.topic.findMany({
                where: {
                    id: {
                        in: topic[`${environment}ParentIds`]
                    }
                }
            });
            // Push mocked new topic.
            created.push({
                title: topic.title,
                language: topic.language,
                translations: topic.translations,
                parents: parents.map((parent) => ({ id: parent.id, title: parent.title }))
            });
        }
    }

    return created;
};

const runScript = async (): Promise<void> => {
    const fileContents = readDataFromFile();

    if (fileContents.error) {
        console.log('Read file error: ', fileContents.error);
    } else {
        const { environment, dryRun } = parseArguments();

        const result = await validateData(fileContents.data, environment);

        if (result.valid) {
            const createdTopics = await createTopics(fileContents.data, environment, dryRun);
            console.log(
                dryRun
                    ? 'Dry run complete.'
                    : 'Real run complete.' +
                          ` Created ${createdTopics.length} topics out of ${fileContents.data.length}.`
            );
            console.log(JSON.stringify(createdTopics));
        } else {
            console.log('Failed validation.', result);
        }
    }
};

void runScript();
