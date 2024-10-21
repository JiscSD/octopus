import 'dotenv/config';
import * as userController from 'user/controller';
import * as fs from 'fs';

const inputFileName = 'scripts/updateOrganisationalAccount.json';
const regenerateApiKeyArgName = 'regenerateApiKey';

// Updates an organisational user with details from an input file or just regenerates their API key.
const updateOrganisationalAccount = async (): Promise<string> => {
    // This may be run just to regenerate the API key, in which case an extra arg will be supplied.
    if (process.argv[2] && process.argv[2] !== regenerateApiKeyArgName) {
        return `Unrecognised argument provided. Did you mean "${regenerateApiKeyArgName}"?`;
    }

    const regenerateApiKey = process.argv[2] === regenerateApiKeyArgName;
    const inputFileExists = fs.existsSync(inputFileName);

    if (!inputFileExists) {
        return `Input file "${inputFileName}" not found.`;
    }

    const data = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));

    if (!(typeof data === 'object' && !Array.isArray(data) && data !== null)) {
        return 'Supplied data must be an object.';
    }

    if (!Object.prototype.hasOwnProperty.call(data, 'id')) {
        return 'Data must contain an "id" property.';
    }

    const updatedUser = await userController.updateOrganisationalAccount(data.id, data, regenerateApiKey);

    return JSON.stringify(updatedUser);
};

updateOrganisationalAccount()
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
