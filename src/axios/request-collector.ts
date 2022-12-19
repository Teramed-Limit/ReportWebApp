import { AxiosRequestConfig } from 'axios';
import Axios from 'axios-observable';

import { LoginResult, RefreshTokenResult } from '../interface/auth';
import { delay, generateUUID, isEmptyOrNil } from '../utils/general';

// 某些頁面會一次發多個Request，但是如果Token過期，會發過多的Refresh Token導致，Token一直更新
// 因為打多次的RefreshToken api，所以前幾個RefreshToken都是無效的，導至後端會判斷為無效Token，前端直接跳至登入頁面
// 解決方案為蒐集500ms內的request並只打一次RefreshToken api，之後的request都用這組Token就解決了
export class RequestCollector {
    queueRequests: string[] = [];
    hasRefreshToken = false;
    accessToken = '';

    refreshToken: (result: RefreshTokenResult) => void = () => {};

    queueRequest = (): number => {
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
        const retryAxios = Axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
            withCredentials: true,
        });

        if (!this.hasRefreshToken) {
            this.hasRefreshToken = true;

            const loginUser = JSON.parse(<string>localStorage.getItem('user')) as LoginResult;

            const refreshTokenResponse = await retryAxios
                .post<RefreshTokenResult>(`api/refreshtoken`, {
                    UserId: loginUser?.UserId,
                })
                .toPromise();

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

        if (requestIndex === this.queueRequests.length - 1) {
            this.clearRequest();
        }

        return retryAxios.request(newConfig).toPromise();
    };
}
