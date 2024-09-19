import * as api from '@/api';

const endpoints = {
    authorization: `${api.baseURL}/authorization`,
    bookmarks: `${api.baseURL}/bookmarks`,
    crosslinks: `${api.baseURL}/crosslinks`,
    decodeUserToken: `${api.baseURL}/decode-user-token`,
    flags: `${api.baseURL}/flags`,
    links: `${api.baseURL}/links`,
    publications: `${api.baseURL}/publications`,
    publicationVersions: `${api.baseURL}/publication-versions`,
    revokeOrcidAccess: `${api.baseURL}/revoke-orcid-access`,
    topics: `${api.baseURL}/topics`,
    users: `${api.baseURL}/users`,
    verification: `${api.baseURL}/verification`,
    verifyOrcidAccess: `${api.baseURL}/verify-orcid-access`
};

export default endpoints;
