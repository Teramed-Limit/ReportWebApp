export interface ReportSetting {
    ReportERSTypeList: ReportERSTypeList[];
    ReportTemplateList: ReportTemplateList[];
    ReportReferringProviderList: ReportReferringProviderList[];
    ReportIndicationList: ReportIndicationList[];
    CapturesMappingFindingsList: CapturesMappingFindingsList[];
}

export interface ReportERSTypeList {
    Code: number;
    Name: string;
    ProcedureCode: string;
}

export interface ReportTemplateList {
    Code: number;
    ERSType: string;
    Name: string;
}

export interface ReportReferringProviderList {
    Code: number;
    Name: string;
}

export interface ReportIndicationList {
    Code: number;
    ERSType: string;
    Name: string;
}

export interface CapturesMappingFindingsList {
    Code: number;
    ERSType: string;
    Name: string;
}
