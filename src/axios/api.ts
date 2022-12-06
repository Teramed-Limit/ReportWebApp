import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { AnyObject } from '../interface/anyObject';
import { LoginResult } from '../interface/auth';
import { CodeListMap } from '../interface/code-list';
import { FormDefineMap, FormHistoryDefine } from '../interface/define';
import { Diagram } from '../interface/diagram';
import { DocumentData } from '../interface/document-data';
import { HkcctCode } from '../interface/hkcct';
import { ReportFinding, TemplateFinding } from '../interface/report-finding';
import { ReportTimelineData } from '../interface/report-timeline';
import { StudyData } from '../interface/study-data';
import { SystemConfig } from '../interface/system-config';
import { axiosIns } from './axios';

export function login(userId: string, password: string): Observable<AxiosResponse<LoginResult>> {
    return axiosIns.post<LoginResult>(`api/login`, {
        userId,
        password,
    });
}

export function logout() {
    return axiosIns.post(`api/logout`);
}

export function refreshToken(userId: string) {
    return axiosIns.post(`api/refreshtoken`, { userId });
}

export function fetchReport(studyInsUid: string): Observable<AxiosResponse<DocumentData>> {
    return axiosIns.get<DocumentData>(`api/standard/report/studyInstanceUID/${studyInsUid}`);
}

export function fetchHistoryReport(
    studyInsUid: string,
    version: string,
): Observable<AxiosResponse<DocumentData>> {
    return axiosIns.get<DocumentData>(
        `api/standard/report/history/studyInstanceUID/${studyInsUid}/version/${version}`,
    );
}

export function fetchReportTimeline(
    studyInsUid: string,
): Observable<AxiosResponse<ReportTimelineData>> {
    return axiosIns.get(`api/standard/report/timeline/studyInstanceUID/${studyInsUid}`);
}

export function fetchReportDefine(): Observable<AxiosResponse<FormDefineMap>> {
    return axiosIns.get(`api/standard/report/define`);
}

export function fetchReportHistoryDefine(
    studyInsUid: string,
    version: string,
): Observable<AxiosResponse<FormHistoryDefine>> {
    return axiosIns.get(
        `api/standard/report/define/studyInstanceUID/${studyInsUid}/version/${version}`,
    );
}

export function saveReport(body): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.post(`api/standard/report`, body);
}

export function saveReportPDF(studyInsUid: string, body): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.post(`api/standard/report/studyInstanceUID/${studyInsUid}/pdfSave`, body);
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

// 獲取 Report Diagram
export function fetchDiagram(reportTemplate: string): Observable<AxiosResponse<Diagram[]>> {
    return axiosIns.get(`api/diagrams/reportTemplate/${reportTemplate}`);
}

// 儲存 Report Diagram
export function saveDiagram(
    reportTemplate: string,
    data: FormData,
): Observable<AxiosResponse<Diagram[]>> {
    return axiosIns.post(`api/diagrams/reportTemplate/${reportTemplate}`, data);
}

// 刪除 Report Diagram
export function deleteDiagram(
    reportTemplate: string,
    number: number,
): Observable<AxiosResponse<Diagram[]>> {
    return axiosIns.delete(`api/diagrams/reportTemplate/${reportTemplate}/number/${number}`);
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

export function fetchHistoryStudy(queryParams: any): Observable<AxiosResponse<StudyData[]>> {
    return axiosIns.get('api/queryHistoryStudy', queryParams);
}

export function fetchSystemConfig(): Observable<AxiosResponse<SystemConfig>> {
    return axiosIns.get('api/systemConfig');
}
