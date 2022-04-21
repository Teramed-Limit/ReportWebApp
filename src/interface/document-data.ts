export interface DocumentData {
    ReportImageDataset?: ReportImageDataset[];
    ReportMarkDataset?: ReportMark[];
    InstrumentDataset?: string[];
    HISConsumableDataset?: HISConsumableDataset[];
    HISLabRequestsDataset?: HISLabRequestsDataset[];
    HISMedicationDataset?: HISMedicationDataset[];
    EpisodeNo?: string;
    HISProcedureID?: string;
    Dept?: string;
    StaffCode?: string;
    AccessionNumber?: string;
    OwnerId?: string;
    StudyInstanceUID?: string;
    ERSType?: string;
    ReferringProvider?: string;
    ReportTemplate?: string;
    Sedation?: string;
    Anesthesiologist?: string;
    ChiefEndoscopist?: string;
    Endoscopist?: string;
    ProcedureDate?: string;
    Instrument?: string;
    AssistingNurse?: string;
    Indication?: string;
    IndicationOptional?: string;
    ManagementPlan?: string;
    DiagnosisPrimary?: string;
    DiagnosisSecondary?: string;
    DiagnosisExtra?: string;
    ProcedurePrimary?: string;
    ProcedureSecondary?: string;
    ProcedureExtra?: string;
    Findings?: string;
    Esophagus?: string;
    Cardia?: string;
    Fundus?: string;
    Corpus?: string;
    Antrum?: string;
    Pyloric?: string;
    D1?: string;
    D2?: string;
    Terminallleum?: string;
    Caecum?: string;
    AscendingColon?: string;
    HepaticFlexure?: string;
    Transverse?: string;
    SplenicFlexure?: string;
    Descending?: string;
    Sigmoid?: string;
    Rectum?: string;
    CaptureMapping?: string;
    ReportImages?: string;
    ReportMarks?: string;
    QualityOfBowelPreparation?: string;
    BBPS_Right?: number;
    BBPS_Transverse?: number;
    BBPS_Left?: number;
    WithdrawalTime?: number;
    IsCaecumReached?: string;
    MechanicalObstruction?: string;
    TechnicalDifficulties?: string;
    PostRighthemicolectomy?: string;
    BowelPreparation?: string;
    PlannedforPartialColonoscopy?: string;
    OccurrenceofComplication?: string;
    Other?: string;
    OtherDescription?: string;
    StartTimeHour?: string;
    StartTimeMin?: string;
    EndTimeHour?: string;
    EndTimeMin?: string;
    DiagramData?: string;
    SignOffsDateTime?: string;
    SignOffsData?: any;
    PDFFilePath?: string;
    Author?: string;
    QualityBowelScore?: number;
    ReportStatus?: ReportStatus;
}

export enum ReportStatus {
    Newly = 'newly',
    Saved = 'saved',
    Signed = 'signed',
}

export interface ReportImageDataset {
    SOPInstanceUID: string;
    ImageSrc: string;
    IsAttachInReport: boolean;
    MappingNumber: number;
    // DescriptionOfSites: string;
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

export interface HISConsumableDataset {
    Number: number;
    CUMC_NO: string;
    EpisodeNo: string;
    ItemID: string;
    ItemAlias: string;
    ItemName: string;
    ItemUnitID: string;
    ItemUnitName: string;
    Quantity: number;
    EntryDateTime: string;
    IsSelected: string;
}

export interface HISLabRequestsDataset {
    Number: number;
    CUMC_NO: string;
    EpisodeNo: string;
    ItemName: string;
    RequestDate: string;
    Discipline: string;
    LabTestDesc: string;
    NoOfSample: string;
    SpecimenNo: string;
    SpecifiedLocation: string;
    TypeOfOperation: string;
    Preparation: string;
    Remarks: string;
    TestUrgency: string;
    RequestDoctorCode: string;
    IsSelected: string;
}

export interface HISMedicationDataset {
    Number: number;
    CUMC_NO: string;
    EpisodeNo: string;
    MedicationPrescribeDate: string;
    MedicationAdminDateTime: string;
    DoctorCode: string;
    MedicationName: string;
    MedicationForm: string;
    MedicationStrength: string;
    MedicationRoute: string;
    MedicationDose: string;
    MedicationFrequency: string;
    MedicationDuration: string;
    IsSelected: string;
}
