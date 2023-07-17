import { atom } from 'recoil';

import { AttributeProps } from '../components/AttributeList/AttributeList';
import { FormDefine } from '../interface/define';
import { ReportComponentType } from '../interface/report-generator/component/rep-component';

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

export const selectedAttributeProps = atom<Partial<AttributeProps>>({
    key: 'report-generator-attribute-props',
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
