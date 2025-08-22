import 'dotenv/config';
import * as funderService from '../src/components/funder/service';
import * as publicationVersionService from '../src/components/publicationVersion/service';
import * as fs from 'fs';
import * as Helpers from 'lib/helpers';

type InputData = {
    publicationVersionIds: string[];
    funderData: { name: string; ror?: string; city: string; country: string; link: string; grantId?: string };
};

const updateFunder = async (data: InputData, dryRun: boolean, emptyOnly: boolean): Promise<string[]> => {
    const response: string[] = [];

    for (const publicationVersionId of data.publicationVersionIds) {
        const pubVersion = await publicationVersionService.get(publicationVersionId, 'latestLive');

        if (!pubVersion) {
            throw new Error(`Publication version with ID ${publicationVersionId} does not exist.`);
        }

        if (pubVersion.funders.length > 0) {
            if (emptyOnly) {
                throw new Error(
                    `Publication version with ID ${publicationVersionId} already has at least one funder. Call with emptyOnly=false to update existing funders.`
                );
            }

            const existingFunder = pubVersion.funders.find(
                (f) => f.ror === data.funderData.ror || f.link === data.funderData.link
            );

            if (existingFunder) {
                console.log(
                    `Publication version with ID ${publicationVersionId} already has a funder with the same ROR or link. Skipping creation.`
                );
                continue;
            }

            console.log(
                `Publication version with ID ${publicationVersionId} already has funders, will create a new one`
            );
        }

        if (dryRun) {
            console.log(
                `Dry run: would update funder for publication version ID ${publicationVersionId} from data:`,
                JSON.stringify(pubVersion.funders, null, 2) + ` to ${JSON.stringify(data.funderData, null, 2)}`
            );
            continue;
        }

        try {
            const funder = await funderService.create(pubVersion.id, data.funderData);
            console.log(`Created funder with ID ${funder.id} for publication version ID ${publicationVersionId}`);
            response.push(funder.ror || '');
        } catch (error) {
            console.error(`Error creating funder for publication version ID ${publicationVersionId}:`, error);
            response.push(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    return response;
};

const readDataFromFile = (inputFileName: string): { data: InputData | null; error?: string } => {
    if (!fs.existsSync(inputFileName)) {
        return {
            data: null,
            error: `Input file "${inputFileName}" not found.`
        };
    }

    const fileData = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));

    return {
        data: fileData
    };
};

const parseArguments = (): { dryRun: boolean } => {
    const args = Helpers.parseNpmScriptArgs();

    const dryRunArg = args.dryRun;

    if (dryRunArg && !(dryRunArg === 'true' || dryRunArg === 'false')) {
        throw new Error('dryRun must be one of "true" or "false"');
    }

    return {
        dryRun: dryRunArg === 'false' ? false : true
    };
};

const validateData = (data: InputData): { valid: boolean; messages: string[] } => {
    let valid = true;
    const messages: string[] = [];

    if (!data || !data.publicationVersionIds || !data.funderData) {
        return { valid: false, messages: ['Input data is invalid or missing required fields.'] };
    }

    for (const publicationVersionId of data.publicationVersionIds) {
        if (!publicationVersionId) {
            valid = false;
            messages.push('Publication version ID is required and cannot be empty.');
        }
    }

    for (const key of Object.keys(data.funderData)) {
        if (!data.funderData[key]) {
            valid = false;
            messages.push(`The property "${key}" is required and cannot be empty.`);
        }
    }

    return { valid, messages };
};

const inputFileName = 'scripts/updateFunderData.json';

const runScript = async (): Promise<void> => {
    const fileContents = readDataFromFile(inputFileName);

    if (fileContents.error) {
        console.log('Read file error: ', fileContents.error);

        return;
    }

    if (!fileContents.data) {
        console.log('No data found in the input file.');

        return;
    }

    const { dryRun } = parseArguments();

    const result = validateData(fileContents.data);

    if (result.valid) {
        const createdMappings = await updateFunder(fileContents.data, dryRun, true);
        console.log(
            dryRun ? 'Dry run complete.' : 'Real run complete.' + ` Created funder rors: ${createdMappings.join(', ')}`
        );
        console.log(createdMappings);
    } else {
        console.log('Failed validation.', result);
    }
};

void runScript();
