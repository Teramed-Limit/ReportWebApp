import { Style } from '@react-pdf/types/style';

import { Field } from './report-field/field';

export interface FormDefineMap {
    [props: string]: FormDefineDto;
}

export interface FormDefineDto {
    ReportType: string;
    FormDefine: string;
    ImageDefine: string;
    Header: string;
    Footer: string;
}

export interface FormHistoryDefine {
    ReportDefine: string;
}

export interface FormDefine {
    sections: Section[];
    modal?: ModalSection;
}

export interface Section {
    id: string;
    hide?: boolean;
    hideInPDF: boolean;
    label?: string;
    type: string;
    maxWidth?: string;
    isHeader?: boolean;
    subSections: SubSection[];
    style?: Style;
}
export interface SubSection {
    id: string;
    maxWidth?: string;
    fields: Field[];
    style?: Style;
}

export interface ModalSection {
    modalName: string;
    sections: Section[];
}
