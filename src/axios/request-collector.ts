import axios, { AxiosRequestConfig } from 'axios';

import { LoginResult, RefreshTokenResult } from '../interface/auth';
import ConfigService from '../service/config-service';
import { delay, generateUUID, isEmptyOrNil } from '../utils/general';

// 某些頁面會一次發多個Request，但是如果Token過期，會發過多的Refresh Token導致，Token一直更新
// 因為打多次的RefreshToken api，所以前幾個RefreshToken都是無效的，導至後端會判斷為無效Token，前端直接跳至登入頁面
// 解決方案為蒐集500ms內的request並只打一次RefreshToken api，之後的request都用這組Token就解決了
export class RequestCollector {
    queueRequests: string[] = [];
    hasRefreshToken = false;
    accessToken = '';

    refreshToken: (result: RefreshTokenResult) => void = () => {};

    queueRequest = async (): Promise<number> => {
        this.queueRequests.push(generateUUID());
        return this.queueRequests.length - 1;
    };

    registerRefreshToken = (refreshToken: (result: RefreshTokenResult) => void) => {
        this.refreshToken = refreshToken;
    };

    clearRequest = () => {
        this.queueRequests = [];
        this.accessToken = '';
        this.hasRefreshToken = false;
    };

    request = async (
        requestConfig: AxiosRequestConfig,
        requestIndex: number,
    ): Promise<AxiosRequestConfig> => {
        const retryAxios = axios.create({
            baseURL: ConfigService.getIpAddress(),
            withCredentials: true,
        });

        if (!this.hasRefreshToken) {
            this.hasRefreshToken = true;

            const loginUser = JSON.parse(<string>localStorage.getItem('user')) as LoginResult;

            const refreshTokenResponse = await retryAxios.post<RefreshTokenResult>(
                `api/refreshtoken`,
                {
                    UserId: loginUser?.UserId,
                },
            );

            this.refreshToken(refreshTokenResponse.data);
            this.accessToken = refreshTokenResponse.data.AccessToken;
        }

        while (isEmptyOrNil(this.accessToken)) {
            // eslint-disable-next-line no-await-in-loop
            await delay(500);
        }

        const newConfig = { ...requestConfig };
        if (!newConfig?.headers) newConfig.headers = {};
        newConfig.headers.Authorization = `Bearer ${this.accessToken}`;
        // cancelToken
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        newConfig.cancelToken = source.token;

        if (requestIndex === this.queueRequests.length - 1) {
            this.clearRequest();
        }

        return retryAxios.request(newConfig);
    };
}
