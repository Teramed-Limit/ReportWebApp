import { FilterCondition, OptionSource } from './report-field/selection-field';
import { Validate } from './validate';

export interface FormEditorDef {
    sections: FormSection[];
}

export interface FormSection {
    id: string;
    fields: FormField[];
}

export enum FormFieldEditorType {
    Text = 'Text',
    TextArea = 'TextArea',
    Dropdown = 'Dropdown',
    Number = 'Number',
    DataRange = 'DataRange',
    ImageSelect = 'ImageSelect',
    Checkbox = 'Checkbox',
    SingleSelect = 'SingleSelect',
    MultiSelect = 'MultiSelect',
}

export interface FormField {
    id: string;
    label: string;
    type: string;
    validate?: Validate;
    isKey?: boolean;
    readOnly?: boolean;
    hide?: boolean;
}

export interface FormSelectionField extends FormField {
    isMulti?: boolean;
    optionSource: OptionSource<any>;
    filterCondition: FilterCondition;
}
