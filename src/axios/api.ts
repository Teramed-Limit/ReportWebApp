import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { AnyObject } from '../interface/anyObject';
import { LoginResult } from '../interface/auth';
import { CodeList, CodeListMap } from '../interface/code-list';
import { Diagram } from '../interface/diagram';
import { DocumentData, ReportImageDataset } from '../interface/document-data';
import { HkcctCode } from '../interface/hkcct';
import { MergeStudyParams } from '../interface/merge-study';
import { ReportFinding, TemplateFinding } from '../interface/report-finding';
import { ReportSetting } from '../interface/report-setting';
import { Study } from '../interface/study';
import { StudyData } from '../interface/study-data';
import { axiosIns } from './axios';

// export function fetchReportDefine(): Observable<AxiosResponse> {
//     return axiosIns.get(`getReportDefine`);
// }

export function login(username: string, password: string): Observable<AxiosResponse<LoginResult>> {
    return axiosIns.post<LoginResult>(`api/login`, {
        username,
        password,
    });
}

export function logout() {
    return axiosIns.post(`api/logout`);
}

export function refreshToken(token: string, userName: string) {
    return axiosIns.post(`api/refreshtoken`, { refreshToken: token, userName });
}

export function fetchReport(studyInsUid: string): Observable<AxiosResponse<DocumentData>> {
    return axiosIns.get<DocumentData>(`api/standard/report/studyInstanceUID/${studyInsUid}`);
}

export function saveReport(body): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.post(`api/standard/report`, body);
}

export function signOffReport(studyInsUid: string, body): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.post(`api/standard/report/studyInstanceUID/${studyInsUid}/signOff`, body);
}

export function saveReportPDF(studyInsUid: string, body): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.post(`api/standard/report/studyInstanceUID/${studyInsUid}/pdfSave`, body);
}

// Report setting
export function fetchReportSetting(): Observable<AxiosResponse<ReportSetting>> {
    return axiosIns.get(`api/report/setting`);
}

// 獲取 Code list
export function fetchCodeList(): Observable<AxiosResponse<CodeListMap>> {
    return axiosIns.get(`api/codelist`);
}

// 新增 Code list by code name
export function insertCodeListByCodeName(codeName: string): Observable<any> {
    return axiosIns.post(`api/codelist/codeName/${codeName}`);
}

// 刪除 Code list by code name
export function deleteCodeListByCodeName(codeName: string): Observable<any> {
    return axiosIns.delete(`api/codelist/codeName/${codeName}`);
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

// fill in details
export function getReportFindings(
    type: string,
    fieldId: string,
): Observable<AxiosResponse<ReportFinding[]>> {
    return axiosIns.get(`api/findingsTemplate/type/${type}/fieldId/${fieldId}`);
}

export function saveReportFindings(
    type: string,
    fieldId: string,
    body: ReportFinding[],
): Observable<AxiosResponse<ReportFinding[]>> {
    return axiosIns.post(`api/findingsTemplate/type/${type}/fieldId/${fieldId}`, body);
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

export function fetchStudy(queryParams: any): Observable<AxiosResponse<StudyData[]>> {
    return axiosIns.get('api/queryStudy', queryParams);
}

export function fetchSamePatientStudies(
    studyInstanceUID: string,
): Observable<AxiosResponse<Study[]>> {
    return axiosIns.get(`api/GetOtherStudy/studyInstanceUID/${studyInstanceUID}`);
}

export function mergeStudy(
    body: MergeStudyParams,
): Observable<AxiosResponse<ReportImageDataset[]>> {
    return axiosIns.post(`api/MergeStudy`, body);
}
