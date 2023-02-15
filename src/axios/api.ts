import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { AnyObject } from '../interface/anyObject';
import { LoginResult } from '../interface/auth';
import { CodeListMap } from '../interface/code-list';
import { FormDefineMap, FormHistoryDefine } from '../interface/define';
import { Diagram } from '../interface/diagram';
import { DocumentData } from '../interface/document-data';
import {
    CategoryContents,
    FormFieldLexicon,
    FormFieldLexiconCategory,
    ReorderFormFieldLexiconCategoryBody,
} from '../interface/form-field-lexicon-category';
import { HkcctCode } from '../interface/hkcct';
import { ReportTimelineData } from '../interface/report-timeline';
import { StudyData } from '../interface/study-data';
import { SystemConfig } from '../interface/system-config';
import { axiosIns } from './axios';

export function checkIsRepeatLogin(userId: string): Observable<AxiosResponse<boolean>> {
    return axiosIns.get<boolean>(`api/checkIsRepeatLogin/userId/${userId}`);
}

export function login(userId: string, password: string): Observable<AxiosResponse<LoginResult>> {
    return axiosIns.post<LoginResult>(`api/login`, {
        userId,
        password,
    });
}

export function fetchLoginStatus(): Observable<AxiosResponse<StudyData[]>> {
    return axiosIns.get('api/login/status');
}

export function logout() {
    return axiosIns.post(`api/logout`);
}

export function logoutSpecifyUser(userId: string) {
    return axiosIns.post(`api/logout/userId/${userId}`);
}

export function refreshToken(userId: string) {
    return axiosIns.post(`api/refreshtoken`, { userId });
}

export function fetchReport(studyInsUid: string): Observable<AxiosResponse<DocumentData>> {
    return axiosIns.get<DocumentData>(`api/report/studyInstanceUID/${studyInsUid}`);
}

export function fetchHistoryReport(
    studyInsUid: string,
    version: string,
): Observable<AxiosResponse<DocumentData>> {
    return axiosIns.get<DocumentData>(
        `api/report/history/studyInstanceUID/${studyInsUid}/version/${version}`,
    );
}

export function fetchReportTimeline(
    studyInsUid: string,
): Observable<AxiosResponse<ReportTimelineData>> {
    return axiosIns.get(`api/report/timeline/studyInstanceUID/${studyInsUid}`);
}

export function fetchReportDefine(): Observable<AxiosResponse<FormDefineMap>> {
    return axiosIns.get(`api/report/define`);
}

export function fetchReportHistoryDefine(
    studyInsUid: string,
    version: string,
): Observable<AxiosResponse<FormHistoryDefine>> {
    return axiosIns.get(`api/report/define/studyInstanceUID/${studyInsUid}/version/${version}`);
}

export function saveReport(body): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.post(`api/report`, body);
}

export function downloadReportPdf(studyInsUid): Observable<AxiosResponse<AnyObject>> {
    return axiosIns.get(`api/report/studyInstanceUID/${studyInsUid}/downloadPDF`);
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
export function getFormFieldLexiconCategory(
    type: string,
    fieldId: string,
): Observable<AxiosResponse<FormFieldLexiconCategory[]>> {
    return axiosIns.get(`api/formFieldLexiconCategory/type/${type}/fieldId/${fieldId}`);
}

// fill in details insert "FormFieldLexiconCategory"
export function addFormFieldLexiconCategory(
    body: FormFieldLexiconCategory,
): Observable<AxiosResponse> {
    return axiosIns.post(`api/formFieldLexiconCategory`, body);
}

// fill in details delete "FormFieldLexiconCategory"
export function deleteFormFieldLexiconCategory(id: string): Observable<AxiosResponse> {
    return axiosIns.delete(`api/formFieldLexiconCategory/id/${id}`);
}

// fill in details insert "FormFieldLexiconCategory"
export function addFormFieldLexiconCategoryContent(
    body: CategoryContents,
): Observable<AxiosResponse> {
    return axiosIns.post(`api/formFieldLexiconCategoryContent`, body);
}

// fill in details delete "FormFieldLexiconCategory"
export function deleteFormFieldLexiconCategoryContent(id: string): Observable<AxiosResponse> {
    return axiosIns.delete(`api/formFieldLexiconCategoryContent/id/${id}`);
}

// fill in details reorder "FormFieldLexiconCategory"
export function reorderFormFieldLexiconCategory(
    body: ReorderFormFieldLexiconCategoryBody[],
): Observable<AxiosResponse> {
    return axiosIns.put(`api/formFieldLexiconCategory/reorder`, body);
}

// Field Lexicon
export function getFieldLexicon(
    template: string,
    fieldId: string,
): Observable<AxiosResponse<FormFieldLexicon[]>> {
    return axiosIns.get(`api/fieldLexicon/template/${template}/field/${fieldId}`);
}

// Field Lexicon
export function createFieldLexicon(body): Observable<AxiosResponse<FormFieldLexicon[]>> {
    return axiosIns.post(`api/fieldLexicon`, body);
}

// Field Lexicon
export function deleteFieldLexicon(number: number): Observable<AxiosResponse<FormFieldLexicon[]>> {
    return axiosIns.delete(`api/fieldLexicon/number/${number}`);
}

export function deleteStudy(studyInstanceUid: string, password = ''): Observable<AxiosResponse> {
    return axiosIns.delete(`api/deleteStudy/studyInstanceUID/${studyInstanceUid}`, {
        data: { password },
    });
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

export function getReportLockStatus(studyInstanceUid: string): Observable<AxiosResponse<string>> {
    return axiosIns.get(`api/report/lock/status/studyInstanceUID/${studyInstanceUid}`);
}

export function lockReport(studyInstanceUid: string): Observable<AxiosResponse<boolean>> {
    return axiosIns.post(`api/report/lock/studyInstanceUID/${studyInstanceUid}`);
}

export function unlockReport(studyInstanceUid: string): Observable<AxiosResponse<boolean>> {
    return axiosIns.post(`api/report/unlock/studyInstanceUID/${studyInstanceUid}`);
}
