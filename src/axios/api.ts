import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { AnyObject } from '../interface/anyObject';
import { Diagram } from '../interface/diagram';
import { DocumentData, ReportImageDataset } from '../interface/document-data';
import { ERSLog, SignatureData } from '../interface/ers-log';
import { HkcctCode } from '../interface/hkcct';
import { MergeStudyParams } from '../interface/merge-study';
import { Option } from '../interface/option';
import { PatientProcedureInfo } from '../interface/procedure-info';
import { ReportFinding, TemplateFinding } from '../interface/report-finding';
import { ReportSetting } from '../interface/report-setting';
import { Study } from '../interface/study';
import { axiosIns } from './axios';

// export function fetchReportDefine(): Observable<AxiosResponse> {
//     return axiosIns.get(`getReportDefine`);
// }

export function fetchReport(
    episodeNo: string,
    procedureId: string,
    dept: string,
    staffCode: string,
): Observable<AxiosResponse<DocumentData>> {
    return axiosIns.get<DocumentData>(
        `api/report/episodeNo/${episodeNo}/procedureId/${procedureId}/dept/${dept}/staffCode/${staffCode}`,
    );
}

export function saveReport(body): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.post(`api/report`, body);
}

export function signOffReport(body): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.post(`api/signOff`, body);
}

export function previewReport(
    studyInstanceUID: string,
    episodeNo: string,
    generatePDF: boolean,
): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.get(
        `api/report/studyInstanceUID/${studyInstanceUID}/episodeNo/${episodeNo}/generatePDF/${generatePDF}`,
    );
}

// Report setting
export function fetchReportSetting(): Observable<AxiosResponse<ReportSetting>> {
    return axiosIns.get(`api/report/setting`);
}

// Instrument
export function fetchInstrumentList(episodeNo: string): Observable<AxiosResponse<Option[]>> {
    return axiosIns.get(`api/instruments/episodeNo/${episodeNo}`);
}

// Report Diagram
export function fetchDiagram(ersType: string): Observable<AxiosResponse<Diagram[]>> {
    return axiosIns.get(`api/diagrams/ersType/${ersType}`);
}

// HKCTT Lexicon
export function getHKCTTAlias(
    searchStr: string,
    type: 'Diagnosis' | 'Procedure' | undefined,
): Observable<AxiosResponse<HkcctCode[]>> {
    return axiosIns.get(`api/hkcctAlias/type/${type}`, { params: { searchStr } });
}

export function getReportFindings(type: string): Observable<AxiosResponse<ReportFinding[]>> {
    return axiosIns.get(`api/findingsTemplate/type/${type}`);
}

export function saveReportFindings(
    type: string,
    body: ReportFinding[],
): Observable<AxiosResponse<ReportFinding[]>> {
    return axiosIns.post(`api/findingsTemplate/type/${type}`, body);
}

// old ver.
export function retrieveFindingsTemplate(
    type: string,
): Observable<AxiosResponse<TemplateFinding[]>> {
    return axiosIns.get(`api/retrieveFindingsTemplate/type/${type}`);
}

// old ver.
export function createFindingsTemplate(body): Observable<AxiosResponse<TemplateFinding[]>> {
    return axiosIns.post(`api/createFindingsTemplate`, body);
}

// old ver.
export function deleteFindingsTemplate(
    number: number,
): Observable<AxiosResponse<TemplateFinding[]>> {
    return axiosIns.delete(`api/deleteFindingsTemplate/number/${number}`);
}

export function fetchPatientAndDoctor(
    episodeNo: string,
    procedureId: string,
    dept: string,
): Observable<AxiosResponse<PatientProcedureInfo[]>> {
    return axiosIns.get(
        `api/getHISPatientAndProcedure/episodeNo/${episodeNo}/procedureId/${procedureId}/dept/${dept}`,
    );
}

export function fetchNurse(dept: string): Observable<AxiosResponse<Option[]>> {
    return axiosIns.get(`api/getNurseList/dept/${dept}`);
}

export function fetchHISConsumable(episodeNo: string, dept: string): Observable<AxiosResponse> {
    return axiosIns.get(`api/consumable/episodeNo/${episodeNo}/dept/${dept}`);
}

export function fetchHISLabRequests(
    episodeNo: string,
    staffCode: string,
): Observable<AxiosResponse> {
    return axiosIns.get(`api/lab/episodeNo/${episodeNo}/staffCode/${staffCode}`);
}

export function fetchHISMedication(
    episodeNo: string,
    staffCode: string,
): Observable<AxiosResponse> {
    return axiosIns.get(`api/medication/episodeNo/${episodeNo}/staffCode/${staffCode}`);
}

export function fetchStudies(
    patientID: string,
    studyInstanceUID: string,
): Observable<AxiosResponse<Study[]>> {
    return axiosIns.get(
        `api/GetOtherStudy/documentNo/${patientID}/studyInstanceUID/${studyInstanceUID}`,
    );
}

export function mergeStudy(
    body: MergeStudyParams,
): Observable<AxiosResponse<ReportImageDataset[]>> {
    return axiosIns.post(`api/MergeStudy`, body);
}

export function fetchStudiesStatus(episodeNo: string): Observable<AxiosResponse<ERSLog>> {
    return axiosIns.get(`api/SearchEpisodeNo/episodeNo/${episodeNo}`);
}

export function fetchDoctorSignature(staffCode: string): Observable<AxiosResponse<SignatureData>> {
    return axiosIns.get(`api/GetDoctorSignature/staffCode/${staffCode}`);
}

export function fetchServiceLog(
    episodeNo: string,
    serviceName: string,
): Observable<AxiosResponse<string>> {
    return axiosIns.get(`api/GetServiceLog/episodeNo/${episodeNo}/serviceName/${serviceName}`);
}
