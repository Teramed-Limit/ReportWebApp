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
    UserId?: string;
    PDFFilePath?: string;
    AccessionNumber?: string;
    StudyDescription?: string;
    Modality?: string;
    DateTime?: Date;
    ReportImageData?: ReportImageData[];
    [prop: string]: any;
}

export enum ReportStatus {
    New = 'New',
    Saved = 'Saved',
    Signed = 'Signed',
}

export interface ReportImageData {
    SOPInstanceUID: string;
    ImageSrc: string;
    thumbnailImageSrc: string;
    EditedImageSrc: string;
    IsAttachInReport: boolean;
    MappingNumber: number;
    ReportMark?: ReportMark;
    [prop: string]: any;
    DescriptionOfSites: string;
    DescriptionOfFindings: string;
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
