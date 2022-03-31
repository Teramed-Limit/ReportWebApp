import Axios from 'axios-observable';
import { LoginResult } from '../interface/auth';

export const axiosIns = Axios.create({
    baseURL: process.env.REACT_APP_REST_API,
});

export const setupInterceptors = (removeAuth: () => void) => {
    axiosIns.interceptors.request.use((config) => {
        const newConfig = { ...config };
        const accessToken = (JSON.parse(<string>localStorage.getItem('user')) as LoginResult)
            ?.AccessToken;
        if (accessToken) {
            newConfig.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });

    axiosIns.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = { ...err.config };

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
