import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

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
        break;
    default:
        baseURL = 'https://api.octopus.ac/v1';
        break;
}

const api = axios.create({
    baseURL,
    timeout: 5000
});

export const get = async (url: string, token: string | undefined): Promise<AxiosResponse> => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await api.get(url, token ? headers : undefined);
    return response;
};

export const post = async (url: string, body: Interfaces.JSON, token: string | undefined): Promise<AxiosResponse> => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await api.post(url, body, token ? headers : undefined);
    return response;
};

export const patch = async (url: string, body: Interfaces.JSON, token: string | undefined): Promise<AxiosResponse> => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await api.patch(url, body, token ? headers : undefined);
    return response;
};

export const search = async (
    searchType: string | Types.SearchType,
    query: string | null = null,
    publicationType: string | null = null,
    limit: number | null = null,
    offset: number | null = null,
    orderBy: Types.OrderBySearchOption | null = null,
    orderDirection: Types.OrderDirectionSearchOption | null = null
): Promise<Interfaces.SearchResults> => {
    let endpoint: string = searchType === 'users' ? Config.endpoints.users : Config.endpoints.publications;
    let params: string = '';

    // Global search params
    limit && (params += '&limit=' + limit);
    offset && (params += '&offset=' + offset);
    orderBy && (params += '&orderBy=' + orderBy);
    orderDirection && (params += '&orderDirection=' + orderDirection);
    query && (params += '&search=' + query);

    // publication specific params
    searchType === 'publications' && publicationType && (params += '&type=' + publicationType);

    params.includes('&') && (params = params.replace('&', '?'));

    const response = await get(endpoint + params, undefined);
    return response.data;
};
