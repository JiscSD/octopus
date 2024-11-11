export let baseURL: string;

switch (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF) {
    case 'local':
        baseURL = 'http://127.0.0.1:4003/local/v1'; // https://github.com/node-fetch/node-fetch/issues/1624
        break;
    case 'main':
        baseURL = 'https://octopus.ac/v1';
        break;
    default:
        baseURL = `https://${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}.octopus.ac/v1`;
        break;
}

export default {
    authorization: `${baseURL}/authorization`,
    base: baseURL,
    bookmarks: `${baseURL}/bookmarks`,
    crosslinks: `${baseURL}/crosslinks`,
    decodeUserToken: `${baseURL}/decode-user-token`,
    flags: `${baseURL}/flags`,
    links: `${baseURL}/links`,
    publications: `${baseURL}/publications`,
    publicationVersions: `${baseURL}/publication-versions`,
    revokeOrcidAccess: `${baseURL}/revoke-orcid-access`,
    topics: `${baseURL}/topics`,
    users: `${baseURL}/users`,
    verification: `${baseURL}/verification`,
    verifyOrcidAccess: `${baseURL}/verify-orcid-access`
};
