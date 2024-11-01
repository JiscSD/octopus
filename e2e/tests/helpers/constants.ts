export const MAILPIT = process.env.MAILPIT;
export const STORAGE_STATE_BASE = 'playwright/.auth/';

const requiredEnvVariables = [
    'ORCID_TEST_USER',
    'ORCID_TEST_PASS',
    'ORCID_TEST_FIRST_NAME',
    'ORCID_TEST_LAST_NAME',
    'ORCID_TEST_USER2',
    'ORCID_TEST_PASS2',
    'ORCID_TEST_FIRST_NAME2',
    'ORCID_TEST_LAST_NAME2',
    'ORCID_TEST_USER3',
    'ORCID_TEST_PASS3',
    'ORCID_TEST_FIRST_NAME3',
    'ORCID_TEST_LAST_NAME3',
    'ORCID_TEST_USER4',
    'ORCID_TEST_PASS4',
    'ORCID_TEST_FIRST_NAME4',
    'ORCID_TEST_LAST_NAME4',
    'MAILPIT',
    'UI_BASE'
];

function checkEnvVariable(variableName: string) {
    if (process.env[variableName] === undefined) {
        throw new Error(`Environment Variable '${variableName}' is undefined.`);
    }
}

requiredEnvVariables.forEach(checkEnvVariable);
