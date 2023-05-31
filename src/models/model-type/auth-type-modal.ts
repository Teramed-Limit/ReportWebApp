import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IMaybe, IModelType, Instance, IOptionalIType, ISimpleType, IType } from 'mst-effect';
import { Observable } from 'rxjs';

import { LoginResult, RefreshTokenResult } from '../../interface/auth';
import { RoleFunction } from '../../interface/user-role';

interface AuthTypeOfModal extends ModelProperties {
    isAuth: IOptionalIType<ISimpleType<unknown>, [undefined]>;
    functionList: IType<RoleFunction[] | undefined | null, RoleFunction[], RoleFunction[]>;
    userName: IMaybe<ISimpleType<unknown>>;
    accessToken: IMaybe<ISimpleType<unknown>>;
    userId: IMaybe<ISimpleType<unknown>>;
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
    registerAuth: (data: LoginResult) => void;
    removeAuth: () => void;
    refreshToken: (data: RefreshTokenResult) => void;
}

export type AuthTypeModal = IModelType<AuthTypeOfModal, AuthTypeOfActions, any, any>;

export type AuthStore = Instance<AuthTypeModal>;
