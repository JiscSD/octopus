/**
 * Use this script to import user mappings from a data file at ./user-mappings.json.
 * The data in that file should match the "CreateUserMappingData" type in this file.
 *
 * By default, the script will perform a dry run, aiming at the local/int environments.
 * To change this, provide args as follows:
 *
 * npm run createUserMappings -- environment=prod dryRun=false
 */

import * as client from '../src/lib/client';
import * as fs from 'fs';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

type CreateUserMappingData = {
    // The external source system to map data from.
    source: I.PublicationImportSource;
    // The incoming value to map to a user.
    value: string;
    // The firstName of the existing user in octopus.
    octopusUserName: string;
    // The ID of the existing user in octopus on local/int environments.
    intExistingUserId: string;
    // The ID of the existing user in octopus on the prod environment.
    prodExistingUserId: string;
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

const readDataFromFile = (): { data: CreateUserMappingData[]; error?: string } => {
    const inputFileName = 'scripts/user-mappings.json';

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
    data: CreateUserMappingData[],
    environment: I.Environment = 'int'
): Promise<{ valid: boolean; messages: string[] }> => {
    let valid = true;
    const messages: string[] = [];

    // Ensure values are unique.
    const uniqueValues = new Set();
    const duplicateValues: string[] = [];

    for (const item of data) {
        const value = item.value;

        if (uniqueValues.has(value)) {
            duplicateValues.push(value);
        } else {
            uniqueValues.add(value);
        }

        if (!(item.intExistingUserId && item.prodExistingUserId)) {
            valid = false;
            messages.push(`User mapping "${item.value}" does not have existing IDs provided for both environments.`);
        }

        // Check DB for existing user.
        const existingUser = await client.prisma.user.findUnique({
            where: {
                id: item[`${environment}ExistingUserId`]
            }
        });

        if (!existingUser) {
            valid = false;
            messages.push(`Existing user for mapping "${item.value}" could not be found in the database.`);
        } else {
            if (existingUser.firstName !== item.octopusUserName) {
                valid = false;
                messages.push(
                    `Existing user for mapping "${item.value}" (${existingUser.firstName}) has been found but the name doesn't match what was provided (${item.octopusUserName}).`
                );
            }

            if (existingUser.role !== 'ORGANISATION') {
                valid = false;
                messages.push(
                    `Existing user for mapping "${item.value}" (${existingUser.firstName}) has been found but it is not an organisational account.`
                );
            }
        }
    }

    if (duplicateValues.length) {
        valid = false;
        messages.push(`Duplicate values detected: ${duplicateValues.join(', ')}`);
    }

    return {
        valid,
        messages
    };
};

type CreatedUserMapping = {
    value: string;
    user?: {
        id: string;
        firstName: string;
    };
};

const createUserMappings = async (
    data: CreateUserMappingData[],
    environment: I.Environment = 'int',
    dryRun?: boolean
): Promise<CreatedUserMapping[]> => {
    const created: CreatedUserMapping[] = [];

    for (const mapping of data) {
        let createdMapping;

        if (!dryRun) {
            try {
                createdMapping = await client.prisma.userMapping.create({
                    data: {
                        value: mapping.value,
                        source: mapping.source,
                        userId: mapping[`${environment}ExistingUserId`]
                    },
                    select: {
                        value: true,
                        source: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true
                            }
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            } finally {
                created.push({
                    value: createdMapping.value,
                    user: createdMapping.user
                });
            }
        } else {
            // Push mocked new user mapping.
            created.push({
                value: mapping.value.toLowerCase(), // prisma client extension lower cases value on save
                user: {
                    id: mapping[`${environment}ExistingUserId`],
                    firstName: mapping.octopusUserName
                }
            });
        }
    }

    return created;
};

const runScript = async (): Promise<void> => {
    const fileContents = readDataFromFile();

    if (fileContents.error) {
        console.log('Read file error: ', fileContents.error);
    }

    const { environment, dryRun } = parseArguments();

    const result = await validateData(fileContents.data, environment);

    if (result.valid) {
        const createdMappings = await createUserMappings(fileContents.data, environment, dryRun);
        console.log(
            dryRun
                ? 'Dry run complete.'
                : 'Real run complete.' +
                      ` Created ${createdMappings.length} mappings out of ${fileContents.data.length}.`
        );
        console.log(createdMappings);
    } else {
        console.log('Failed validation.', result);
    }
};

void runScript();
