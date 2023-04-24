import axios, { AxiosError } from 'axios';

import { RequestCollector } from './request-collector';
import { LoginResult, RefreshTokenResult } from '../interface/auth';
import { createObservable } from '../utils/axios-observable';
import { delay } from '../utils/general';

const axiosIns = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export function httpReq<T, D = any>() {
    return (config: D) => createObservable<T, D>(axiosIns, config);
}

const requestCollector = new RequestCollector();

export const setupInterceptors = (
    refreshToken: (result: RefreshTokenResult) => void,
    removeAuth: () => void,
) => {
    requestCollector.registerRefreshToken(refreshToken);

    axiosIns.interceptors.request.use((config) => {
        const newConfig = { ...config };

        const accessToken = (JSON.parse(<string>localStorage.getItem('user')) as LoginResult)
            ?.AccessToken;

        if (accessToken) {
            newConfig.headers.Authorization = `Bearer ${accessToken}`;
        }

        return newConfig;
    });

    axiosIns.interceptors.response.use(
        async (res) => {
            return res;
        },
        async (err: AxiosError) => {
            const originalConfig = err?.config;

            if (!originalConfig) return Promise.reject(err);

            if (originalConfig.url !== '/auth/login' && err.response) {
                // Access Token was expired
                if (err.response.status === 401) {
                    try {
                        const requestIndex = await requestCollector.queueRequest();
                        await delay(300);
                        return await requestCollector.request(originalConfig, requestIndex);
                    } catch (_error) {
                        if (axios.isCancel(_error)) {
                            return Promise.reject(_error);
                        }
                        removeAuth();
                        requestCollector.clearRequest();
                        return Promise.reject(_error);
                    }
                }
            }

            // Skip login request
            if (originalConfig.url !== 'api/login' && err.response) {
                // Access Token was expired
                if (err.response.status === 401) {
                    removeAuth();
                }
            }

            return Promise.reject(err);
        },
    );
};
