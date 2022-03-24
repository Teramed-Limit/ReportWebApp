import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { AnyObject } from '../interface/anyObject';
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

export function fetchReport(studyInsUid: string): Observable<AxiosResponse<DocumentData>> {
    return axiosIns.get<DocumentData>(`api/report/studyInstanceUID/${studyInsUid}`);
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
