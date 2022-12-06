import axios, { AxiosError } from 'axios';
import Axios from 'axios-observable';

import { LoginResult, RefreshTokenResult } from '../interface/auth';

export const axiosIns = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const setupInterceptors = (
    refreshToken: (result: RefreshTokenResult) => void,
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

        return newConfig;
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

                        // 重新發送一次，Axios必須是新的物件，否則會重複打Api
                        const retryAxios = axios.create({
                            baseURL: import.meta.env.VITE_BASE_URL,
                            withCredentials: true,
                        });

                        const rs = await retryAxios.post<RefreshTokenResult>(`api/refreshtoken`, {
                            UserId: loginUser?.UserId,
                        });

                        refreshToken(rs.data);

                        const newConfig = { ...originalConfig };
                        if (!newConfig?.headers) newConfig.headers = {};
                        newConfig.headers.Authorization = `Bearer ${rs.data.AccessToken}`;

                        return await retryAxios(newConfig);
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
