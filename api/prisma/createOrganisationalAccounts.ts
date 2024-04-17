import * as userController from 'user/controller';
import * as fs from 'fs';

const inputFileName = 'prisma/createOrganisationalAccounts.json';

// Creates organisational users with details from an input file.
const createOrganisationalAccounts = async (): Promise<string> => {
    if (!fs.existsSync(inputFileName)) {
        return `Input file "${inputFileName}" not found.`;
    }
    const data = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));
    const createdUsers = await userController.createOrganisationalAccounts(data);
    return JSON.stringify(createdUsers);
};

createOrganisationalAccounts()
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
