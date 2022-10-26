import { AxiosError } from 'axios';
import { action, dollEffect, getRoot, Instance, types } from 'mst-effect';
import { catchError, map, switchMap } from 'rxjs/operators';

import { login, logout } from '../axios/api';
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
        // let timer: Subscription | undefined;

        // const getTokenRemainingTime = (): number => {
        //     const { accessToken } = self;
        //     if (!accessToken) {
        //         return 0;
        //     }
        //     const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
        //     const expires = new Date(jwtToken.exp * 1000);
        //     return expires.getTime() - Date.now();
        // };
        //
        // const stopTokenTimer = () => {
        //     timer?.unsubscribe();
        //     timer = undefined;
        // };
        //
        // const startTokenTimer = () => {
        //     const delayTime = getTokenRemainingTime();
        //
        //     if (timer) return;
        //
        //     timer = interval(delayTime - 5000)
        //         .pipe(concatMap(() => refreshToken(self?.refreshToken || '')))
        //         .subscribe({
        //             next: () => {},
        //             error: () => {
        //                 action(removeAuth);
        //             },
        //         });
        // };

        const registerAuth = (data: LoginResult) => {
            self.isAuth = true;
            self.functionList = data.FunctionList;
            self.accessToken = data.AccessToken;
            self.refreshToken = data.RefreshToken;
            self.loginUser = data.UserName;
            // startTokenTimer();
            localStorage.setItem('user', JSON.stringify(data));
        };

        const removeAuth = () => {
            self.isAuth = false;
            self.functionList = [];
            self.accessToken = undefined;
            self.refreshToken = undefined;
            self.loginUser = undefined;
            // stopTokenTimer();
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
                                    action(registerAuth, response.data),
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
            registerAuth,
            removeAuth,
        };
    });

export type AuthStore = Instance<typeof AuthModel>;
