import { AxiosError } from 'axios';
import { action, dollEffect, Instance, types } from 'mst-effect';
import { catchError, map, switchMap } from 'rxjs/operators';

import { checkIsRepeatLogin, login, logout } from '../axios/api';
import { LoginResult, RefreshTokenResult } from '../interface/auth';
import { RoleFunction } from '../interface/user-role';

export const AuthModel = types
    .model('auth', {
        userId: types.maybe(types.string),
        userName: types.maybe(types.string),
        avatarImg: types.maybe(types.string),
        functionList: types.frozen<RoleFunction[]>([]),
        accessToken: types.maybe(types.string),
        isAuth: types.optional(types.boolean, false),
    })
    /* eslint-disable no-param-reassign */
    .actions((self) => {
        const registerAuth = (data: LoginResult) => {
            self.isAuth = true;
            self.functionList = data.FunctionList;
            self.accessToken = data.AccessToken;
            self.userId = data.UserId;
            self.userName = data?.UserName || undefined;
            self.avatarImg = data?.AvatarImg || undefined;
            localStorage.setItem('user', JSON.stringify(data));
        };

        const refreshToken = (data: RefreshTokenResult) => {
            self.accessToken = data.AccessToken;
            localStorage.setItem(
                'user',
                JSON.stringify({
                    UserId: self.userId,
                    UserName: self.userName,
                    AvatarImg: self.avatarImg,
                    FunctionList: self.functionList,
                    AccessToken: data.AccessToken,
                }),
            );
        };

        const removeAuth = () => {
            self.isAuth = false;
            self.functionList = [];
            self.accessToken = undefined;
            self.userId = undefined;
            self.userName = undefined;
            self.avatarImg = undefined;
            localStorage.removeItem('user');
        };

        return {
            onCheckIsRepeatLogin: dollEffect<{ userId: string }, boolean>(
                self,
                (payload$, dollSignal) =>
                    payload$.pipe(
                        switchMap(({ userId }) =>
                            checkIsRepeatLogin(userId).pipe(
                                map((response) => [action(dollSignal, response.data)]),
                                catchError((error: AxiosError) => [
                                    action(dollSignal, error.response?.data.Message),
                                ]),
                            ),
                        ),
                    ),
            ),
            onLogin: dollEffect<{ userId: string; password: string }, string>(
                self,
                (payload$, dollSignal) =>
                    payload$.pipe(
                        switchMap(({ userId, password }) =>
                            login(userId, password).pipe(
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
            refreshToken,
            removeAuth,
        };
    });

export type AuthStore = Instance<typeof AuthModel>;
