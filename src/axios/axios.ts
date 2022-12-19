import { AxiosError } from 'axios';
import Axios from 'axios-observable';

import { LoginResult, RefreshTokenResult } from '../interface/auth';
import { delay } from '../utils/general';
import { RequestCollector } from './request-collector';

export const axiosIns = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

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
            if (!newConfig?.headers) newConfig.headers = {};
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

            if (originalConfig.url !== '/auth/login' && err.response) {
                // Access Token was expired
                if (err.response.status === 401) {
                    try {
                        const requestIndex = requestCollector.queueRequest();
                        await delay(500);
                        return await requestCollector.request(originalConfig, requestIndex);
                    } catch (_error) {
                        removeAuth();
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
