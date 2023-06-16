import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { httpReq } from './axios';
import { AnyObject } from '../interface/anyObject';
import { LoginResult, UserAccountInfo } from '../interface/auth';
import { CodeList, CodeListMap } from '../interface/code-list';
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
import { LoginStatusData } from '../interface/login-status';
import { ReportTimelineData } from '../interface/report-timeline';
import { StudyData } from '../interface/study-data';
import { SystemConfig } from '../interface/system-config';
import { RoleFunction } from '../interface/user-role';
import LocalStorageService from '../service/local-storage-service';

export const checkIsRepeatLogin = (userId): Observable<AxiosResponse<boolean>> => {
    return httpReq<boolean>()({
        method: 'get',
        url: `api/checkIsRepeatLogin/userId/${userId}`,
    });
};

export function login(userId: string, password: string): Observable<AxiosResponse<LoginResult>> {
    return httpReq<LoginResult>()({
        method: 'post',
        url: `api/login`,
        data: { userId, password },
    });
}

export function getUserInfo(userId: string): Observable<AxiosResponse<UserAccountInfo>> {
    return httpReq<UserAccountInfo>()({
        method: 'get',
        url: `api/account/userId/${userId}`,
    });
}

export function updateUserInfo(userId: string): Observable<AxiosResponse<any>> {
    return httpReq<any>()({
        method: 'post',
        url: `api/account/userId/${userId}`,
    });
}

export function fetchLoginStatus(): Observable<AxiosResponse<LoginStatusData[]>> {
    return httpReq<LoginStatusData[]>()({
        method: 'get',
        url: `api/login/status`,
    });
}

export function logout() {
    return httpReq()({
        method: 'post',
        url: `api/logout`,
    });
}

export function logoutSpecifyUser(userId: string) {
    return httpReq()({
        method: 'post',
        url: `api/logout/userId/${userId}`,
    });
}

export function refreshToken(userId: string) {
    return httpReq<LoginResult>()({
        method: 'post',
        url: `api/refreshtoken`,
        data: { userId },
    });
}

export function fetchReport(studyInsUid: string): Observable<AxiosResponse<DocumentData>> {
    return httpReq<DocumentData>()({
        method: 'get',
        url: `api/report/studyInstanceUID/${studyInsUid}`,
    });
}

export function fetchHistoryReport(
    studyInsUid: string,
    version: string,
): Observable<AxiosResponse<DocumentData>> {
    return httpReq<DocumentData>()({
        method: 'get',
        url: `api/report/history/studyInstanceUID/${studyInsUid}/version/${version}`,
    });
}

export function fetchReportTimeline(
    studyInsUid: string,
): Observable<AxiosResponse<ReportTimelineData>> {
    return httpReq<ReportTimelineData>()({
        method: 'get',
        url: `api/report/timeline/studyInstanceUID/${studyInsUid}`,
    });
}

export function fetchReportDefine(): Observable<AxiosResponse<FormDefineMap>> {
    return httpReq<FormDefineMap>()({
        method: 'get',
        url: `api/report/define`,
    });
}

export function fetchReportHistoryDefine(
    studyInsUid: string,
    version: string,
): Observable<AxiosResponse<FormHistoryDefine>> {
    return httpReq<FormHistoryDefine>()({
        method: 'get',
        url: `api/report/define/studyInstanceUID/${studyInsUid}/version/${version}`,
    });
}

export function addReportDefine(
    reportType: string,
    defineType: string,
): Observable<AxiosResponse<AnyObject>> {
    return httpReq<AnyObject>()({
        method: 'post',
        url: `api/report/define/reportType/${reportType}/defineType/${defineType}/newly`,
    });
}

export function modifyReportDefine(
    reportType: string,
    defineType: string,
): Observable<AxiosResponse<AnyObject>> {
    return httpReq<AnyObject>()({
        method: 'post',
        url: `api/report/define/reportType/${reportType}/defineType/${defineType}`,
    });
}

export function saveReport(body): Observable<AxiosResponse<AnyObject>> {
    return httpReq<AnyObject>()({
        method: 'post',
        url: `api/report`,
        data: body,
    });
}

export function downloadReportPdf(studyInsUid): Observable<AxiosResponse<AnyObject>> {
    return httpReq<AnyObject>()({
        method: 'get',
        url: `api/report/studyInstanceUID/${studyInsUid}/downloadPDF`,
    });
}

// 獲取 Code list
export function fetchCodeList(excludeList?: string[]): Observable<AxiosResponse<CodeListMap>> {
    return httpReq<CodeListMap>()({
        method: 'get',
        url: `api/codelist`,
        params: { exclude: excludeList?.join('%') },
    });
}

// 獲取 Code list
export function fetchCodeListByCode(codeName: string) {
    return httpReq<CodeList[]>()({
        method: 'get',
        url: `api/codelist/codeName/${codeName}`,
    });
}

// 新增 Code list by code name
export function insertCodeListByCodeName(codeName: string): Observable<any> {
    return httpReq<any>()({
        method: 'post',
        url: `api/codelist/codeName/${codeName}`,
    });
}

// 刪除 Code list by code name
export function deleteCodeListByCodeName(codeName: string): Observable<any> {
    return httpReq<any>()({
        method: 'delete',
        url: `api/codelist/codeName/${codeName}`,
    });
}

// 獲取 Report Diagram
export function fetchDiagram(reportTemplate: string): Observable<AxiosResponse<Diagram[]>> {
    return httpReq<Diagram[]>()({
        method: 'get',
        url: `api/diagrams/reportTemplate/${reportTemplate}`,
    });
}

// 儲存 Report Diagram
export function saveDiagram(
    reportTemplate: string,
    data: FormData,
): Observable<AxiosResponse<Diagram[]>> {
    return httpReq<Diagram[]>()({
        method: 'post',
        url: `api/diagrams/reportTemplate/${reportTemplate}`,
        data,
    });
}

// 刪除 Report Diagram
export function deleteDiagram(
    reportTemplate: string,
    number: number,
): Observable<AxiosResponse<Diagram[]>> {
    return httpReq<Diagram[]>()({
        method: 'delete',
        url: `api/diagrams/reportTemplate/${reportTemplate}/number/${number}`,
    });
}

// HKCTT Lexicon
export function getHKCTTAlias(
    searchStr: string,
    type: 'Diagnosis' | 'Procedure' | undefined,
): Observable<AxiosResponse<HkcctCode[]>> {
    return httpReq<HkcctCode[]>()({
        method: 'get',
        url: `api/hkcctAlias/type/${type}`,
        params: { searchStr },
    });
}

// fill in details
export function getFormFieldLexiconCategory(
    type: string,
    fieldId: string,
): Observable<AxiosResponse<FormFieldLexiconCategory[]>> {
    return httpReq<FormFieldLexiconCategory[]>()({
        method: 'get',
        url: `api/formFieldLexiconCategory/type/${type}/fieldId/${fieldId}`,
    });
}

// fill in details insert "FormFieldLexiconCategory"
export function addFormFieldLexiconCategory(
    body: FormFieldLexiconCategory,
): Observable<AxiosResponse> {
    return httpReq<any>()({
        method: 'post',
        url: `api/formFieldLexiconCategory`,
        data: body,
    });
}

// fill in details delete "FormFieldLexiconCategory"
export function deleteFormFieldLexiconCategory(id: string): Observable<AxiosResponse> {
    return httpReq<any>()({
        method: 'delete',
        url: `api/formFieldLexiconCategory/id/${id}`,
    });
}

// fill in details insert "FormFieldLexiconCategory"
export function addFormFieldLexiconCategoryContent(
    body: CategoryContents,
): Observable<AxiosResponse> {
    return httpReq<any>()({
        method: 'post',
        url: `api/formFieldLexiconCategoryContent`,
        data: body,
    });
}

// fill in details delete "FormFieldLexiconCategory"
export function deleteFormFieldLexiconCategoryContent(id: string): Observable<AxiosResponse> {
    return httpReq<any>()({
        method: 'delete',
        url: `api/formFieldLexiconCategoryContent/id/${id}`,
    });
}

// fill in details reorder "FormFieldLexiconCategory"
export function reorderFormFieldLexiconCategory(
    body: ReorderFormFieldLexiconCategoryBody[],
): Observable<AxiosResponse> {
    return httpReq<any>()({
        method: 'put',
        url: `api/formFieldLexiconCategory/reorder`,
        data: body,
    });
}

// Field Lexicon
export function getFieldLexicon(
    template: string,
    fieldId: string,
): Observable<AxiosResponse<FormFieldLexicon[]>> {
    return httpReq<FormFieldLexicon[]>()({
        method: 'get',
        url: `api/fieldLexicon/template/${template}/field/${fieldId}`,
    });
}

// Field Lexicon
export function createFieldLexicon(body): Observable<AxiosResponse<FormFieldLexicon[]>> {
    return httpReq<FormFieldLexicon[]>()({
        method: 'post',
        url: `api/fieldLexicon`,
        data: body,
    });
}

// Field Lexicon
export function deleteFieldLexicon(number: number): Observable<AxiosResponse<FormFieldLexicon[]>> {
    return httpReq<FormFieldLexicon[]>()({
        method: 'delete',
        url: `api/fieldLexicon/number/${number}`,
    });
}

export function deleteStudy(studyInstanceUid: string, password = ''): Observable<AxiosResponse> {
    return httpReq<any>()({
        method: 'delete',
        url: `api/deleteStudy/studyInstanceUID/${studyInstanceUid}`,
        data: { password },
    });
}

export function fetchStudy(queryParams: any): Observable<AxiosResponse<StudyData[]>> {
    const functionList = LocalStorageService.getFromLocalStorage<LoginResult>('user')?.FunctionList;
    const accessAllStudies = functionList?.find(
        (item) => item.FunctionName === 'Access All Studies',
    );
    return httpReq<StudyData[]>()({
        method: 'get',
        url: `api/${accessAllStudies ? 'queryStudyWithNoLimit' : 'queryStudy'}`,
        params: queryParams,
    });
}

export function fetchHistoryStudy(queryParams: any): Observable<AxiosResponse<StudyData[]>> {
    return httpReq<StudyData[]>()({
        method: 'get',
        url: `api/queryHistoryStudy`,
        params: queryParams,
    });
}

export function fetchSystemConfig(): Observable<AxiosResponse<SystemConfig>> {
    return httpReq<SystemConfig>()({
        method: 'get',
        url: `api/systemConfig`,
    });
}

export function getReportLockStatus(studyInstanceUid: string): Observable<AxiosResponse<string>> {
    return httpReq<string>()({
        method: 'get',
        url: `api/report/lock/status/studyInstanceUID/${studyInstanceUid}`,
    });
}

export function lockReport(studyInstanceUid: string): Observable<AxiosResponse<boolean>> {
    return httpReq<boolean>()({
        method: 'post',
        url: `api/report/lock/studyInstanceUID/${studyInstanceUid}`,
    });
}

export function unlockReport(studyInstanceUid: string): Observable<AxiosResponse<boolean>> {
    return httpReq<boolean>()({
        method: 'post',
        url: `api/report/unlock/studyInstanceUID/${studyInstanceUid}`,
    });
}

// Role
export function getRoleFunctions(): Observable<AxiosResponse<RoleFunction[]>> {
    return httpReq<RoleFunction[]>()({
        method: 'get',
        url: 'api/role/functions',
    });
}

export function getRoleFunctionsWithRoleName(
    roleName: string,
): Observable<AxiosResponse<RoleFunction[]>> {
    return httpReq<RoleFunction[]>()({
        method: 'get',
        url: `api/role/roleName/${roleName}/functions`,
    });
}

// Function
export function addFunction(
    roleName: string,
    functionName: string,
): Observable<AxiosResponse<RoleFunction[]>> {
    return httpReq<RoleFunction[]>()({
        method: 'post',
        url: `api/role/roleName/${roleName}/function/${functionName}`,
    });
}

export function deleteFunction(
    roleName: string,
    functionName: string,
): Observable<AxiosResponse<RoleFunction[]>> {
    return httpReq<RoleFunction[]>()({
        method: 'delete',
        url: `api/role/roleName/${roleName}/function/${functionName}`,
    });
}
