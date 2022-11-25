export interface DocumentData {
    StudyInstanceUID?: string;
    StudyDate?: string;
    PatientId?: string;
    PatientsName?: string;
    PatientsSex?: string;
    PatientsBirthDate?: string;
    PatientsAge?: string;
    Version?: string;
    ReportTemplate?: string;
    ReportStatus?: ReportStatus;
    Author?: string;
    PDFFilePath?: string;
    AccessionNumber?: string;
    StudyDescription?: string;
    Modality?: string;
    DateTime?: Date;
    ReportImageData?: ReportImageData[];
    [prop: string]: any;
}

export enum ReportStatus {
    InComplete = 'InComplete',
    Saved = 'Saved',
    Signed = 'Signed',
}

export interface ReportImageData {
    SOPInstanceUID: string;
    ImageSrc: string;
    thumbnailImageSrc: string;
    IsAttachInReport: boolean;
    MappingNumber: number;
    DescriptionOfSites: string;
    DescriptionOfFindings: string;
    ReportMark?: ReportMark;
}

export interface ReportMark {
    SOPInstanceUID: string;
    MappingNumber: number;
    PointX: number;
    PointY: number;
    PointInImageX: number;
    PointInImageY: number;
    // OriImgObjActWidth: number;
    // OriImgObjActHeight: number;
}
