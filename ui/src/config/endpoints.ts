import * as API from '@api';

const endpoints = {
    publications: `${API.baseURL}/publications`,
    users: `${API.baseURL}/users`,
    ratings: `${API.baseURL}/ratings`,
    links: `${API.baseURL}/links`,
    authorization: `${API.baseURL}/authorization`
};
export default endpoints;
