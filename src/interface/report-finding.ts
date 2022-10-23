export interface ReportFinding {
    ERSType: string;
    FieldId: string;
    ItemName: string;
    DisplayIndex: number;
    AutoFillDefaultWhenEmpty: string;
    ReportFindingsItemList: ReportFindingItemList[];
    Text: string;
}

export interface ReportFindingItemList {
    Content: string;
    IsDefault: string;
}

export interface TemplateFinding {
    Content: string;
    DisplayIndex: number;
    Number: number;
    ERSType?: string;
}
