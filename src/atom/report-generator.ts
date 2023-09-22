import { atom } from 'recoil';

import { FormDefine } from '../interface/define';
import { Field } from '../interface/report-field/field';
import { ReportComponentType } from '../interface/report-generator/component/rep-component';

export const selectedDefineType = atom<'FormDefine' | 'ImageDefine'>({
    key: 'report-generator-define-type',
    default: 'FormDefine',
});

export const selectedReportDefine = atom<FormDefine>({
    key: 'report-generator-form-define',
    default: { sections: [] },
});

export const selectedReportImageDefine = atom<Field[]>({
    key: 'report-generator-image-define',
    default: [],
});

export const selectedAttributeAtom = atom<any>({
    key: 'report-generator-attribute',
    default: {},
});

// 基於ReportDefine的路徑
// 例如：['sections', 0, 'subsections', 0, 'fields', 0]
export const selectedAttributePathAtom = atom<(string | number)[]>({
    key: 'report-generator-attribute-path',
    default: [],
});

export const previousSelectedAttributePathAtom = atom<(string | number)[]>({
    key: 'previous-report-generator-attribute-path',
    default: [],
});

export const selectedFieldsAtom = atom<Set<string>>({
    key: 'report-generator-selected-fields',
    default: new Set(),
});

export const selectedAttributeTypeAtom = atom<string | undefined>({
    key: 'report-generator-attribute-type',
    default: undefined,
});

export const reportSelectedToolAtom = atom<ReportComponentType>({
    key: 'reportSelectedToolAtom',
    default: ReportComponentType.General,
});
