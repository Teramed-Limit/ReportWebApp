export interface Validate {
    type: ValidateType;
    params?: ValidateParams;
}

export interface ValidateParams {
    [prop: string]: any;
}

export enum ValidateType {
    None = 'none',
    Required = 'required',
    Min = 'min',
    QualityBowelScore = 'qualityBowelScore',
    QualityBowelRequired = 'qualityBowelRequired',
    QualityBowelMin = 'qualityBowelMin',
}
