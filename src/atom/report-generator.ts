import { atom } from 'recoil';

import { ReportComponentType } from '../container/ReportGenerator/ReportComponent/report-component-mapper';
import { FormDefine } from '../interface/define';

export const selectedReportDefine = atom<FormDefine>({
    key: 'report-generator-formDefine',
    default: { sections: [] },
});

export const selectedAttributePath = atom<(string | number)[]>({
    key: 'report-generator-attributePath',
    default: [],
});

export const selectedAttribute = atom({
    key: 'report-generator-attribute',
    default: {},
});

export const reportSelectedTool = atom<ReportComponentType>({
    key: 'reportSelectedTool',
    default: ReportComponentType.General,
});

export const reportZoomState = atom<number>({
    key: 'reportZoomState',
    default: 1.979831932773109,
    // default: 1,
});
