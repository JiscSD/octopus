import axios, { AxiosResponse } from 'axios';

import * as Interfaces from '@/interfaces';
import * as Config from '@/config';
import * as Types from '@/types';

const api = axios.create({
    baseURL: Config.endpoints.base
});

export const get = async (url: string, token?: string): Promise<AxiosResponse> => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await api.get(url, token ? headers : undefined);
    return response;
};

export const post = async <T>(
    url: string,
    body: Interfaces.JSON,
    token: string | undefined
): Promise<AxiosResponse<T>> => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await api.post(url, body, token ? headers : undefined);
    return response;
};

export const patch = async (url: string, body: Interfaces.JSON, token?: string | undefined): Promise<AxiosResponse> => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await api.patch(url, body, token ? headers : undefined);
    return response;
};

export const put = async (
    url: string,
    body: Interfaces.JSON | Record<string, any>[],
    token: string | undefined
): Promise<AxiosResponse> => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await api.put(url, body, token ? headers : undefined);
    return response;
};

export const destroy = async (url: string, token: string | undefined): Promise<AxiosResponse> => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await api.delete(url, token ? headers : undefined);
    return response;
};
