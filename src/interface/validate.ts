export interface Validate {
    type: string;
    params?: ValidateParams;
}

export interface ValidateParams {
    [prop: string]: any;
}
