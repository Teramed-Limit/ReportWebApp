import axios, { AxiosError } from 'axios';
import Axios from 'axios-observable';

import { LoginResult } from '../interface/auth';

export const axiosIns = Axios.create({
    baseURL: process.env.REACT_APP_REST_API,
});

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_REST_API,
});

axiosInstance.interceptors.request.use((config) => {
    const newConfig = { ...config };
    const accessToken = (JSON.parse(<string>localStorage.getItem('user')) as LoginResult)
        ?.AccessToken;
    if (accessToken) {
        if (!newConfig?.headers) newConfig.headers = {};
        newConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export const setupInterceptors = (
    registerAuth: (result: LoginResult) => void,
    removeAuth: () => void,
) => {
    axiosIns.interceptors.request.use((config) => {
        const newConfig = { ...config };
        const accessToken = (JSON.parse(<string>localStorage.getItem('user')) as LoginResult)
            ?.AccessToken;
        if (accessToken) {
            if (!newConfig?.headers) newConfig.headers = {};
            newConfig.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });

    axiosIns.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err: AxiosError) => {
            const originalConfig = err?.config;

            if (originalConfig.url !== '/auth/login' && err.response) {
                // Access Token was expired
                if (err.response.status === 401) {
                    try {
                        const loginUser = JSON.parse(
                            <string>localStorage.getItem('user'),
                        ) as LoginResult;

                        const rs = await axiosInstance.post<LoginResult>(`api/refreshtoken`, {
                            RefreshToken: loginUser?.RefreshToken,
                            UserName: loginUser?.UserName,
                        });

                        registerAuth(rs.data);
                        return await axiosInstance(originalConfig);
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
