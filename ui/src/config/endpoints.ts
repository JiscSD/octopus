import * as api from '@api';

const endpoints = {
    publications: `${api.baseURL}/publications`,
    publicationVersions: `${api.baseURL}/publicationVersions`,
    users: `${api.baseURL}/users`,
    links: `${api.baseURL}/links`,
    authorization: `${api.baseURL}/authorization`,
    verification: `${api.baseURL}/verification`,
    flag: `${api.baseURL}/flag`,
    bookmarks: `${api.baseURL}/bookmarks`,
    decodeUserToken: `${api.baseURL}/decode-user-token`,
    verifyOrcidAccess: `${api.baseURL}/verify-orcid-access`,
    revokeOrcidAccess: `${api.baseURL}/revoke-orcid-access`,
    topics: `${api.baseURL}/topics`
};

export default endpoints;
