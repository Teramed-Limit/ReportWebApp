import { Option } from './option';

export interface PatientProcedureInfo {
    CumcNo: string;
    SurName: string;
    GivenName: string;
    OtherName: string;
    NameChinese: string;
    Birthdate: string;
    Sex: string;
    DocumentType: string;
    DocumentNumber: string;
    HISPatientEpisode: HISPatientEpisode;
    LstHISPatientProcedure: LstHISPatientProcedure[];
    LstHISPatientDoctor: Option[];
    ChiefDoctorList: Option[];
    EndoDoctorList: Option[];
    AnesDoctorList: Option[];
    TimeStartHour: string;
    TimeStartMin: string;
    TimeEndHour: string;
    TimeEndMin: string;
}

export interface HISPatientEpisode {
    CumcNo: string;
    EpisodeNo: string;
    Dept: string;
    BedNo: string;
    AdmissionDate: string;
}

export interface LstHISPatientProcedure {
    EpisodeNo: string;
    ProcedureID: string;
    ProcedureTeam: string;
    AccessionNumber: string;
    StudyInstanceUID: string;
    ProcedureCode: string;
    ProcedureDesc: string;
    ProcedureDatetime: string;
    SedationTypeCode: string;
    SedationType: string;
    StartDate: string;
    Dept: string;
    EndDate: string;
}
