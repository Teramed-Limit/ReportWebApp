import { RoleFunction } from './user-role';

export interface UserAccountInfo {
    userID: string;
    userPassword: string;
    doctorCode: string;
    doctorCName: string;
    doctorEName: string;
    isSupervisor: string;
    roleList: string;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    title: string;
    qualification: string;
    signatureBase64: string;
}

export interface LoginResult {
    UserId: string;
    UserName: string;
    AccessToken: string;
    FunctionList: RoleFunction[];
}

export interface RefreshTokenResult {
    AccessToken: string;
}
