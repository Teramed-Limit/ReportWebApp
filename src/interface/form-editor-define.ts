import { Field } from './field';

export interface FormEditorDef {
    sections: Section[];
}

export interface Section {
    fields: Field[];
}
