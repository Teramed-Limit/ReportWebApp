import axios, { AxiosError, AxiosInstance } from 'axios';

import { LoginResult, RefreshTokenResult } from '../interface/auth';
import { Environment } from '../interface/environment';
import ConfigService from '../service/config-service';
import { createObservable } from '../utils/axios-observable';

let axiosIns: AxiosInstance;

export const fetchAppConfig = async (): Promise<void> => {
    try {
        const response = await axios.get('/config.json');
        const config: Environment = response.data;

        ConfigService.setIpAddress(config.ip_address || '127.0.0.1');

        if (!config) {
            axiosIns = axios;
        } else {
            axiosIns = axios.create({
                baseURL: config.ip_address,
                withCredentials: true,
            });
        }
    } catch (error) {
        console.error('Error fetching config:', error);
        axiosIns = axios;
    }
};

export function httpReq<T, D = any>() {
    return (config: D) => createObservable<T, D>(axiosIns, config);
}

// const requestCollector = new RequestCollector();

export const setupInterceptors = (
    refreshToken: (result: RefreshTokenResult) => void,
    removeAuth: () => void,
) => {
    // requestCollector.registerRefreshToken(refreshToken);

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
                    removeAuth();
                    return Promise.reject(err);
                    // try {
                    //     const requestIndex = await requestCollector.queueRequest();
                    //     await delay(300);
                    //     return await requestCollector.request(originalConfig, requestIndex);
                    // } catch (_error) {
                    //     // requestCollector.request 再拿到401表示有錯誤，直接reject
                    //     if ((_error as AxiosError).response?.status === 401) {
                    //         removeAuth();
                    //     }
                    //
                    //     requestCollector.clearRequest();
                    //
                    //     // requestCollector.request 拿到取消請求，直接reject
                    //     if (axios.isCancel(_error)) {
                    //         return Promise.reject(_error);
                    //     }
                    //
                    //     // requestCollector.request 拿到其他錯誤，清空requestCollector
                    //     return Promise.reject(_error);
                    // }
                }
            }

            // Skip login request
            // if (originalConfig.url !== 'api/login' && err.response) {
            //     // Access Token was expired
            //     if (err.response.status === 401) {
            //         removeAuth();
            //     }
            // }

            return Promise.reject(err);
        },
    );
};
