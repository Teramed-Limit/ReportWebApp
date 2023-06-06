import { AxiosError } from 'axios';
import { action, dollEffect, types } from 'mst-effect';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthTypeModal } from './model-type/auth-type-modal';
import { checkIsRepeatLogin, getUserInfo, login, logout } from '../axios/api';
import { LoginResult, RefreshTokenResult, UserAccountInfo } from '../interface/auth';
import { RoleFunction } from '../interface/user-role';
import LocalStorageService from '../service/local-storage-service';

export const AuthModel: AuthTypeModal = types
    .model('auth', {
        userId: types.maybe(types.string),
        userName: types.maybe(types.string),
        title: types.maybe(types.string),
        jobTitle: types.maybe(types.string),
        summary: types.maybe(types.string),
        signatureUrl: types.maybe(types.string),
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
            self.title = data?.Title || undefined;
            self.jobTitle = data?.JobTitle || undefined;
            self.summary = data?.Summary || undefined;
            self.signatureUrl = data?.SignatureUrl || undefined;
            LocalStorageService.writeToLocalStorage('user', data);
        };

        const refreshToken = (data: RefreshTokenResult) => {
            self.accessToken = data.AccessToken;
            const loginResult = LocalStorageService.getFromLocalStorage<LoginResult>('user');
            if (loginResult) {
                loginResult.AccessToken = data.AccessToken;
                LocalStorageService.writeToLocalStorage('user', loginResult);
            }
        };

        const removeAuth = () => {
            self.isAuth = false;
            self.functionList = [];
            self.accessToken = undefined;
            self.userId = undefined;
            self.userName = undefined;
            self.title = undefined;
            self.jobTitle = undefined;
            self.summary = undefined;
            self.signatureUrl = undefined;
            LocalStorageService.removeFromLocalStorage('user');
        };

        const replaceUserInfo = (data: UserAccountInfo) => {
            const loginResult = LocalStorageService.getFromLocalStorage<LoginResult>('user');
            if (loginResult) {
                loginResult.UserName = data.DoctorEName;
                loginResult.SignatureUrl = data.SignatureUrl;
                loginResult.Summary = data.Summary;
                loginResult.Title = data.Title;
                loginResult.JobTitle = data.JobTitle;
                self.userName = data?.DoctorEName || undefined;
                self.title = data?.Title || undefined;
                self.jobTitle = data?.JobTitle || undefined;
                self.summary = data?.Summary || undefined;
                self.signatureUrl = data?.SignatureUrl || undefined;
                LocalStorageService.writeToLocalStorage('user', loginResult);
            }
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
            renewUserInfo: dollEffect<{ userId: string }, UserAccountInfo>(self, (payload$) =>
                payload$.pipe(
                    switchMap(({ userId }) =>
                        getUserInfo(userId).pipe(
                            map((response) => [action(replaceUserInfo, response.data)]),
                        ),
                    ),
                ),
            ),
            registerAuth,
            refreshToken,
            removeAuth,
        };
    });
