import { colonoscopyDefine } from '../../src/constant/colonoscopy-define';
import { normalizeFields } from '../../src/logic/report-define/report-define-service';
import { colonoscopyFreeTextDefine } from '../../src/constant/colonoscopy-free-text-define';
import { standardDefine } from '../../src/constant/standard-define';
import { ogdDefine } from '../../src/constant/ogd-define';

export const query = {
    episodeNo: 'OP-20-000022-1',
    procedureId: '4E09F2326A2B406986DD8E9D0D2586BE',
    dept: 'EDC',
    staffCode: 'staffCode',
};

export const reportApiPath = `/api/report/episodeNo/${query.episodeNo}/procedureId/${query.procedureId}/dept/${query.dept}/staffCode/${query.staffCode}`;
export const nurseApiPath = `/api/getNurseList/dept/${query.dept}`;
export const settingApiPath = '/api/report/setting';
export const instrumentApiPath = `/api/instruments/episodeNo/${query.episodeNo}`;
export const procedureApiPath = `/api/getHISPatientAndProcedure/episodeNo/${query.episodeNo}/procedureId/${query.procedureId}/dept/${query.dept}`;
export const saveReportApiPath = `/api/report`;
export const previewReportApiPath = `/api/report/studyInstanceUID/**`;
export const signOffReportApiPath = `/api/signOff`;

export const colonoscopyFields = normalizeFields([colonoscopyDefine.sections]);
export const colonoscopyFreeTextFields = normalizeFields([colonoscopyFreeTextDefine.sections]);
export const qualityBowelFields = normalizeFields([colonoscopyDefine.modal.sections]);
export const standardFields = normalizeFields([standardDefine.sections]);
export const ogdFields = normalizeFields([ogdDefine.sections]);
