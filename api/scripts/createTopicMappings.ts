/**
 * Use this script to import topic mappings from a data file at ./topic-mappings.json.
 * The data in that file should match the "CreateTopicMappingData" type in this file.
 *
 * By default, the script will perform a dry run, aiming at the local/int environments.
 * To change this, provide args as follows:
 *
 * npm run createTopicMappings -- environment=prod dryRun=false
 */

import * as client from '../src/lib/client';
import * as fs from 'fs';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

type CreateTopicMappingData = {
    // The external source system to map data from.
    source: I.PublicationImportSource;
    // The title of the incoming topic.
    title: string;
    // The title of the existing topic in octopus.
    octopusTitle: string;
    // The ID of the existing topic in octopus on local/int environments.
    intExistingTopicId: string;
    // The ID of the existing topic in octopus on the prod environment.
    prodExistingTopicId: string;
    // Set to false to intentionally ignore an incoming topic value. Defaults to true.
    isMapped: boolean;
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

const readDataFromFile = (): { data: CreateTopicMappingData[]; error?: string } => {
    const inputFileName = 'scripts/topic-mappings.json';

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
    data: CreateTopicMappingData[],
    environment: I.Environment = 'int'
): Promise<{ valid: boolean; messages: string[] }> => {
    let valid = true;
    const messages: string[] = [];

    // Ensure names are unique.
    const uniqueNames = new Set();
    const duplicateNames: string[] = [];

    for (const item of data) {
        const name = item.title;

        if (uniqueNames.has(name)) {
            duplicateNames.push(name);
        } else {
            uniqueNames.add(name);
        }

        if (item.isMapped) {
            if (!(item.intExistingTopicId && item.prodExistingTopicId)) {
                valid = false;
                messages.push(
                    `Topic mapping "${item.title}" does not have existing IDs provided for both environments.`
                );
            }

            // Check DB for existing topic.
            const existingTopic = await client.prisma.topic.findUnique({
                where: {
                    id: item[`${environment}ExistingTopicId`]
                }
            });

            if (!existingTopic) {
                valid = false;
                messages.push(`Existing topic for mapping "${item.title}" could not be found in the database.`);
            } else {
                if (existingTopic.title !== item.octopusTitle) {
                    valid = false;
                    messages.push(
                        `Existing topic for mapping "${item.title}" (${existingTopic.title}) has been found but the name doesn't match what was provided (${item.octopusTitle}).`
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
    environment: I.Environment = 'int',
    dryRun?: boolean
): Promise<CreatedTopicMapping[]> => {
    const created: CreatedTopicMapping[] = [];

    for (const mapping of data) {
        let createdMapping;

        if (!dryRun) {
            try {
                createdMapping = await client.prisma.topicMapping.create({
                    data: {
                        title: mapping.title,
                        source: mapping.source,
                        ...(mapping.isMapped
                            ? { topicId: mapping[`${environment}ExistingTopicId`] }
                            : { isMapped: false })
                    },
                    select: {
                        isMapped: true,
                        title: true,
                        source: true,
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
                title: mapping.title.toLowerCase(), // prisma client extension lower cases title on save
                ...(mapping.isMapped && {
                    topic: {
                        id: mapping[`${environment}ExistingTopicId`],
                        title: mapping.octopusTitle
                    }
                })
            });
        }
    }

    return created;
};

const fileContents = readDataFromFile();

if (fileContents.error) {
    console.log('Read file error: ', fileContents.error);
}

const { environment, dryRun } = parseArguments();

validateData(fileContents.data, environment)
    .then((result) => {
        if (result.valid) {
            createTopicMappings(fileContents.data, environment, dryRun)
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
