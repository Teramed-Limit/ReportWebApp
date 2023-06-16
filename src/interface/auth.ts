import { RoleFunction } from './user-role';

export interface UserAccountInfo {
    RoleList: string[];
    UserID: string;
    UserPassword: string;
    DoctorCode: string;
    DoctorCName: string;
    DoctorEName: string;
    IsSupervisor: string;
    CreateDateTime: string;
    CreateUser: string;
    ModifiedDateTime: string;
    ModifiedUser: string;
    Title: string;
    Qualification: string;
    SignatureUrl: string;
    JobTitle: string;
    Summary: string;
}

export interface LoginResult {
    UserId: string;
    UserName: string;
    Title: string;
    JobTitle: string;
    Summary: string;
    SignatureUrl: string;
    AccessToken: string;
    FunctionList: RoleFunction[];
}

export interface RefreshTokenResult {
    AccessToken: string;
}
