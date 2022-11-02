import { Field } from './field';

export interface FormDefineMap {
    [props: string]: FormDefineDto;
}

export interface FormDefineDto {
    ReportType: string;
    FormDefine: string;
    PDFDefine: string;
}

export interface FormDefine {
    sections: Section[];
    modal?: ModalSection;
}

export interface Section {
    id: string;
    hide?: boolean;
    label?: string;
    type: string;
    divider?: boolean;
    maxWidth?: string;
    ratio: string[];
    subSections: SubSection[];
}

export interface ModalSection {
    modalName: string;
    sections: Section[];
}

export interface SubSection {
    id: string;
    ratio: string[];
    fields: Field[];
}
