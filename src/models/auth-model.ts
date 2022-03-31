import { AxiosError, AxiosResponse } from 'axios';
import { action, dollEffect, getRoot, Instance, types } from 'mst-effect';
import { of, Subscription } from 'rxjs';
import { catchError, concatMap, delay, map, switchMap } from 'rxjs/operators';

import { login, logout, refreshToken } from '../axios/api';
import { LoginResult } from '../interface/auth';
import { RoleFunction } from '../interface/user-role';

export const AuthModel = types
    .model('auth', {
        loginUser: types.maybe(types.string),
        functionList: types.frozen<RoleFunction[]>([]),
        accessToken: types.maybe(types.string),
        refreshToken: types.maybe(types.string),
        isAuth: types.optional(types.boolean, false),
    })
    /* eslint-disable no-param-reassign */
    .actions((self) => {
        let timer: Subscription;

        const getTokenRemainingTime = () => {
            const { accessToken } = self;
            if (!accessToken) {
                return 0;
            }
            const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
            const expires = new Date(jwtToken.exp * 1000 - 60000);
            return expires.getTime() - Date.now();
        };

        const stopTokenTimer = () => {
            timer?.unsubscribe();
        };

        const startTokenTimer = () => {
            const timeout = getTokenRemainingTime();
            timer = of(true)
                .pipe(
                    delay(timeout),
                    concatMap(() => refreshToken(self?.refreshToken || '')),
                )
                .subscribe({
                    next: () => {},
                    error: () => {
                        action(removeAuth);
                    },
                });
        };

        const registerAuth = (res: AxiosResponse<LoginResult>) => {
            self.isAuth = true;
            self.functionList = res.data.FunctionList;
            self.accessToken = res.data.AccessToken;
            self.refreshToken = res.data.RefreshToken;
            self.loginUser = res.data.Username;
            startTokenTimer();
            localStorage.setItem('user', JSON.stringify(res.data));
        };

        const removeAuth = () => {
            self.isAuth = false;
            self.functionList = [];
            self.accessToken = undefined;
            self.refreshToken = undefined;
            self.loginUser = undefined;
            stopTokenTimer();
            localStorage.removeItem('user');
            const { dataStore } = getRoot(self);
            dataStore.init();
        };

        return {
            onLogin: dollEffect<{ username: string; password: string }, string>(
                self,
                (payload$, dollSignal) =>
                    payload$.pipe(
                        switchMap(({ username, password }) =>
                            login(username, password).pipe(
                                map((response) => [
                                    action(registerAuth, response),
                                    action(dollSignal, ''),
                                ]),
                                catchError((error: AxiosError) => [
                                    action(dollSignal, error.response?.data.Message),
                                ]),
                            ),
                        ),
                    ),
            ),
            onLogout: dollEffect<null, string>(self, (payload$) =>
                payload$.pipe(
                    switchMap(() =>
                        logout().pipe(
                            map(() => [action(removeAuth)]),
                            catchError(() => [action(removeAuth)]),
                        ),
                    ),
                ),
            ),
            onTokenRefresh: dollEffect<null, string>(self, (payload$, dollSignal) =>
                payload$.pipe(
                    switchMap(() =>
                        refreshToken(self?.refreshToken || '').pipe(
                            map((response) => [action(registerAuth, response)]),
                            catchError(() => [action(removeAuth), action(dollSignal, '/login')]),
                        ),
                    ),
                ),
            ),
            removeAuth,
        };
    });

export type AuthStore = Instance<typeof AuthModel>;
