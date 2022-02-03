import axios, { AxiosResponse } from 'axios';

import * as Interfaces from '@interfaces';

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
