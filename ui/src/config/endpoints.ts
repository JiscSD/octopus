import * as api from '@api';

const endpoints = {
    publications: `${api.baseURL}/publications`,
    users: `${api.baseURL}/users`,
    ratings: `${api.baseURL}/ratings`,
    links: `${api.baseURL}/links`,
    authorization: `${api.baseURL}/authorization`,
    flag: `${api.baseURL}/flag`
};
export default endpoints;
