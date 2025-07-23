/**
 * Use this script to update co-authors for publications based on data
 * from a JSON file at ./update-co-authors.json. Example structure:
 * {
 *     "publicationIds": [
 *         "cl3fz14dr0000es6i7dy46y67"
 *     ],
 *     "coAuthorData": {
 *         "confirmedCoAuthor": true,
 *         "retainApproval": true
 *     }
 * }
 *
 * By default, the script will perform a dry run, aiming at the local/int environments.
 * To change this, provide args as follows:
 *
 * npm run updateCoAuthors -- environment=prod dryRun=false
 */

import 'dotenv/config';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationVersionService from 'publicationVersion/service';
import * as coAuthorService from 'coAuthor/service';

type InputData = {
    publicationIds: string[];
    coAuthorData: Prisma.CoAuthorsUpdateInput
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

const readDataFromFile = (): InputData => {
    const inputFileName = 'scripts/update-co-authors.json';

    if (!fs.existsSync(inputFileName)) {
        throw new Error(`Input file "${inputFileName}" not found.`);
    }

    const fileData = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));

    const validPublicationIds = fileData.publicationIds.every(id => typeof id === 'string' && id.trim() !== '');
    const validCoAuthorData = fileData.coAuthorData && Object.keys(fileData.coAuthorData).length > 0;

    if (!validPublicationIds || !validCoAuthorData) {
        throw new Error('Input file must contain valid publication IDs and co-author data.');
    }

    return fileData;
};

const updatePublicationApproval = async (data: InputData, dryRun?: boolean): Promise<void> => {
    const { publicationIds, coAuthorData } = data;

    for (const publicationId of publicationIds) {
        if (!publicationId) {
            console.log('Skipping empty publication ID');
            continue;
        }

        try {
            const publicationVersion = await publicationVersionService.get(publicationId, "latest");

            if (!publicationVersion) {
                console.log(`Publication with ID ${publicationId} not found.`);
                continue;   
            }

            if (publicationVersion.currentStatus === 'LIVE') {
                console.log(`Publication ${publicationId} is LIVE. Co-author updates are not allowed.`);
                continue;
            }

            console.log(`Updating co-authors for publication ${publicationId}. Found ${publicationVersion.coAuthors.length} co-authors.`);

            for (const coAuthor of publicationVersion.coAuthors) {
                if (coAuthor.id === publicationVersion.createdBy) {
                    console.log(`Skipping co-author ${coAuthor.id} as they are the creator of the publication.`);
                    continue;
                }

                if (dryRun) {
                    console.log(`Dry run: would update co-author ${coAuthor.id} with data:`, coAuthorData);
                    continue;
                }

                try {
                    await coAuthorService.update(coAuthor.id, coAuthorData);
                    console.log(`Updated co-author ${coAuthor.id} for publication ${publicationId}`);
                } catch (error) {
                    console.error(`Error updating co-author ${coAuthor.id} for publication ${publicationId}:`, error);
                }
            }

        } catch (error) {
            console.error(`Error fetching publication with ID ${publicationId}:`, error);
            continue;
        }
    }
};

const runScript = async (): Promise<void> => {
    try {
        const fileContents = readDataFromFile();
        const { environment, dryRun } = parseArguments();

        console.log(`Running script in ${environment} environment with dryRun=${dryRun}`);

        await updatePublicationApproval(fileContents, dryRun);

        console.log(dryRun ? 'Dry run complete.' : 'Real run complete.');
    } catch (error) {
        console.error('Error running script:', error);
    }
};

void runScript();
