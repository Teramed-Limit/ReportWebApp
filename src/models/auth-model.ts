import { AxiosError } from 'axios';
import { action, dollEffect, types } from 'mst-effect';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthTypeModal } from './model-type/auth-type-modal';
import { checkIsRepeatLogin, login, logout } from '../axios/api';
import { LoginResult, RefreshTokenResult } from '../interface/auth';
import { RoleFunction } from '../interface/user-role';

export const AuthModel: AuthTypeModal = types
    .model('auth', {
        userId: types.maybe(types.string),
        userName: types.maybe(types.string),
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
            localStorage.setItem('user', JSON.stringify(data));
        };

        const refreshToken = (data: RefreshTokenResult) => {
            self.accessToken = data.AccessToken;
            localStorage.setItem(
                'user',
                JSON.stringify({
                    UserId: self.userId,
                    UserName: self.userName,
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
                                catchError(() => [action(dollSignal, true)]),
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
                                catchError((error: AxiosError<{ Message: string }>) => [
                                    action(
                                        dollSignal,
                                        error?.response?.data.Message || error.message,
                                    ),
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
