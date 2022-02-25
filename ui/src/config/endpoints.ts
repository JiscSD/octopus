import * as API from '@api';

const endpoints = {
    publications: `${API.baseURL}/publications`,
    users: `${API.baseURL}/users`,
    ratings: `${API.baseURL}/ratings`,
    authorization: `${API.baseURL}/authorization`
};
export default endpoints;
