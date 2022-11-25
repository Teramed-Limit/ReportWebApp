export interface StudyData {
    StudyInstanceUID: string;
    StudyDate: string;
    PatientId: string;
    PatientsName: string;
    PatientsSex: string;
    PatientsBirthDate: string;
    PatientsAge: number;
    Version: number;
    ReportStatus: string;
    Author: string;
    PDFFilePath: string;
    AccessionNumber: string;
    StudyDescription: string;
    Modality: string;
    DateTime?: Date;
}
