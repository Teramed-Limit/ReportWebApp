import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IMaybe, IModelType, Instance, IOptionalIType, ISimpleType, IType } from 'mst-effect';
import { Observable } from 'rxjs';

import { LoginResult, RefreshTokenResult, UserAccountInfo } from '../../interface/auth';
import { RoleFunction } from '../../interface/user-role';

interface AuthTypeOfModal extends ModelProperties {
    isAuth: IOptionalIType<ISimpleType<boolean>, [undefined]>;
    userId: IMaybe<ISimpleType<string>>;
    userName: IMaybe<ISimpleType<string>>;
    title: IMaybe<ISimpleType<string>>;
    jobTitle: IMaybe<ISimpleType<string>>;
    summary: IMaybe<ISimpleType<string>>;
    signatureUrl: IMaybe<ISimpleType<string>>;
    functionList: IType<RoleFunction[] | undefined | null, RoleFunction[], RoleFunction[]>;
    accessToken: IMaybe<ISimpleType<string>>;
}

interface AuthTypeOfActions {
    onCheckIsRepeatLogin: <T = boolean>(
        payload: {
            userId: string;
        },
        handler?: (result$: Observable<boolean>) => Observable<T>,
    ) => Promise<T | undefined>;
    onLogin: <T = string>(
        payload: {
            userId: string;
            password: string;
        },
        handler?: (result$: Observable<string>) => Observable<T>,
    ) => Promise<T | undefined>;
    onLogout: <T = string>(
        payload: null,
        handler?: (result$: Observable<string>) => Observable<T>,
    ) => Promise<T | undefined>;
    renewUserInfo: <T = UserAccountInfo>(
        payload: {
            userId: string;
        },
        handler?: (result$: Observable<UserAccountInfo>) => Observable<T>,
    ) => Promise<T | undefined>;
    registerAuth: (data: LoginResult) => void;
    removeAuth: () => void;
    refreshToken: (data: RefreshTokenResult) => void;
}

export type AuthModal = AuthTypeOfModal & AuthTypeOfActions;

export type AuthTypeModal = IModelType<AuthTypeOfModal, AuthTypeOfActions, any, any>;

export type AuthStore = Instance<AuthTypeModal>;
