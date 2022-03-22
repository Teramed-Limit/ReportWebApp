import { Field } from './field';

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
    ratio: string[];
    subSections: SubSection[];
}

export interface ModalSection extends Section {
    modalName: string;
}

export interface SubSection {
    id: string;
    ratio: string[];
    fields: Field[];
}
