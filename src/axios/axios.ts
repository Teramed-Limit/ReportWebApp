import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { LoginResult } from '../interface/auth';
import { Environment } from '../interface/environment';
import ConfigService from '../service/config-service';
import { createObservable } from '../utils/axios-observable';

let axiosIns: AxiosInstance;
let retryAxiosIns: AxiosInstance;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    retry?: boolean;
}

// 用於追蹤是否正在刷新令牌
const isRefreshing = false;
// 存放因等待令牌刷新而在隊列中的請求
let failedQueue: any[] = [];

// 處理等待隊列中的請求，如果有新的令牌則用新的令牌重新發送這些請求
// 如果令牌刷新失敗則拒絕這些請求
const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

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
            retryAxiosIns = axios.create({
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

export const setupInterceptors = (removeAuth: () => void) => {
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
        async (error: AxiosError) => {
            const originalRequest = error?.config as CustomAxiosRequestConfig;

            if (!originalRequest) return Promise.reject(error);

            if (originalRequest.url !== '/auth/login' && error.response) {
                // Access Token was expired
                if (error.response.status === 401) {
                    removeAuth();
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);

            // if (
            //     originalRequest.url !== '/api/login' &&
            //     error.response?.status === 401 &&
            //     !originalRequest.retry
            // ) {
            //     if (isRefreshing) {
            //         // 如果正在刷新令牌，則將請求放入等待隊列中
            //         return new Promise((resolve, reject) => {
            //             failedQueue.push({ resolve, reject });
            //         })
            //             .then((token) => {
            //                 // 令牌刷新成功時用新的令牌重新發送請求
            //                 originalRequest.headers.Authorization = `Bearer ${token}`;
            //                 return axiosIns(originalRequest);
            //             })
            //             .catch((err) => {
            //                 // 令牌刷新失敗時拒絕請求
            //                 if (err.response?.status === 401) removeAuth();
            //                 return Promise.reject(err);
            //             });
            //     }
            //
            //     originalRequest.retry = true;
            //     isRefreshing = true;
            //     const user = JSON.parse(<string>localStorage.getItem('user')) as LoginResult;
            //
            //     try {
            //         const res = await retryAxiosIns.post<RefreshTokenResult>(`api/refreshtoken`, {
            //             UserId: user?.UserId,
            //         });
            //
            //         if (res.data.AccessToken) {
            //             user.AccessToken = res.data.AccessToken;
            //             LocalStorageService.writeToLocalStorage<LoginResult>('user', user);
            //             axiosIns.defaults.headers.common.Authorization = `Bearer ${res.data.AccessToken}`;
            //             originalRequest.headers.Authorization = `Bearer ${res.data.AccessToken}`;
            //             processQueue(null, res.data.AccessToken);
            //             return await axiosIns(originalRequest);
            //         }
            //
            //         processQueue(error, null);
            //         removeAuth();
            //     } catch (err: AxiosError | any) {
            //         processQueue(err, null);
            //         if (err.response?.status === 401) removeAuth();
            //     } finally {
            //         isRefreshing = false;
            //     }
            // }
            //
            // return Promise.reject(error);
        },
    );
};
