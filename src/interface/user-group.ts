export interface UserGroup {
    Name: string;
    Description: string;
    AccessAllStudies: number;
    Level: number;
    Department: string;
    FieldFilterList: FieldFilter[];
}

export interface FieldFilterRule {
    Id: number;
    Field: string;
    Operator: string;
    Value: string;
    AndOr: string;
    BundleConditionStart: boolean;
    BundleConditionEnd: boolean;
    FieldFilterName: string;
}

export interface FieldFilter {
    Name: string;
    Description: string;
    FieldFilterRuleList: FieldFilterRule[];
}

export interface ApplyFieldFilter {
    Name: string;
    Description: string;
    IsApply: boolean;
}
