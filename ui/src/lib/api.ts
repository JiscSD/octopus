import axios, { AxiosResponse } from 'axios';

import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Types from '@types';

export let baseURL: string;

switch (process.env.NEXT_PUBLIC_ENV) {
    case 'local':
        baseURL = 'http://localhost:4003/local/v1';
        break;
    case 'int':
        baseURL = 'https://int.api.octopus.ac/v1';
    default:
        baseURL = 'https://api.octopus.ac/v1';
        break;
}

const api = axios.create({
    baseURL,
    timeout: 5000
});

export const get = async (url: string): Promise<AxiosResponse> => {
    const response = await api.get(url);
    return response;
};

export const post = async (url: string, body: Interfaces.JSON): Promise<AxiosResponse> => {
    const response = await api.post(url, body);
    return response;
};

export const search = async (
    searchType: string | Types.SearchType,
    query: string | null = '',
    publicationType: string | null = Config.values.publicationTypes.join(),
    limit: number = 0,
    offset: number = 0,
    orderBy: Types.OrderBySearchOption = 'createdAt',
    orderDirection: Types.OrderDirectionSearchOption = 'asc'
) => {
    const endpoint = searchType === 'users' ? Config.endpoints.users : Config.endpoints.publications;
    const response = await get(
        `${endpoint}?type=${publicationType}&limit=${limit}&offset=${offset}&orderBy=${orderBy}&orderDirection=${orderDirection}${
            query ? `&search=${query}` : ''
        }`
    );
    return response;
};
