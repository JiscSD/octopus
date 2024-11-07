import 'dotenv/config';
import * as userController from 'user/controller';
import * as fs from 'fs';

const inputFileName = 'scripts/updateOrganisationalAccounts.json';

// Updates an organisational user with details from an input file or just regenerates their API key.
const updateOrganisationalAccounts = async (): Promise<string> => {
    const inputFileExists = fs.existsSync(inputFileName);

    if (!inputFileExists) {
        return `Input file "${inputFileName}" not found.`;
    }

    const data = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));

    if (!Array.isArray(data)) {
        return 'Supplied data must be an array.';
    }

    if (
        !data.every(
            (item) =>
                Object.prototype.hasOwnProperty.call(item, 'intId') &&
                Object.prototype.hasOwnProperty.call(item, 'prodId')
        )
    ) {
        return 'Each object in the data array must contain an "intId" and "prodId" property.';
    }

    return JSON.stringify(await userController.updateOrganisationalAccounts(data));
};

updateOrganisationalAccounts()
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
