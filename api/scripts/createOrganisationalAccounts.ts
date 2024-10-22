import 'dotenv/config';
import * as I from 'interface';
import * as userController from 'user/controller';
import * as fs from 'fs';

const inputFileName = 'scripts/createOrganisationalAccounts.json';

// Creates organisational users with details from an input file.
const createOrganisationalAccounts = async (): Promise<string> => {
    if (!fs.existsSync(inputFileName)) {
        return `Input file "${inputFileName}" not found.`;
    }

    const environment = process.argv[2];

    if (!environment) {
        return 'Expected an environment value ("int" or "prod") to be provided.';
    }

    if (!['int', 'prod'].includes(environment)) {
        return `Invalid environment specified: ${environment}`;
    }

    const data = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));
    const createdUsers = await userController.createOrganisationalAccounts(data, environment as I.Environment);

    return JSON.stringify(createdUsers);
};

createOrganisationalAccounts()
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
