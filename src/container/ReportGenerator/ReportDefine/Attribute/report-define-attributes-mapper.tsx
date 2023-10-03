import { ComponentType } from 'react';

import { ArrayFieldAttribute } from './Field/ReportArrayAttribute/ArrayFieldAttribute';
import ReportArrayAttribute from './Field/ReportArrayAttribute/ReportArrayAttribute';
import { CheckBoxFieldAttribute } from './Field/ReportCheckBoxAttribute/CheckBoxFieldAttribute';
import ReportCheckboxAttribute from './Field/ReportCheckBoxAttribute/ReportCheckboxAttribute';
import { CodeListLexiconAttribute } from './Field/ReportCodeListLexiconAttribute/CodeListLexiconAttribute';
import ReportCodeListLexiconAttribute from './Field/ReportCodeListLexiconAttribute/ReportCodeListLexiconAttribute';
import { CodeListSelectionAttribute } from './Field/ReportCodeListSelectionAttribute/CodeListSelectionAttribute';
import ReportCodeListSelectionAttribute from './Field/ReportCodeListSelectionAttribute/ReportCodeListSelectionAttribute';
import { CompositeFieldAttribute } from './Field/ReportCompositeAttribute/CompositeFieldAttribute';
import ReportCompositeAttribute from './Field/ReportCompositeAttribute/ReportCompositeAttribute';
import { DatePickerFieldAttribute } from './Field/ReportDatePickerAttribute/DatePickerFieldAttribute';
import ReportDatePickerAttribute from './Field/ReportDatePickerAttribute/ReportDatePickerAttribute';
import ReportDiagramAttribute from './Field/ReportDigramAttribute/ReportDiagramAttribute';
import { ReportDiagramFieldAttribute } from './Field/ReportDigramAttribute/ReportDiagramFieldAttribute';
import { NumberFieldAttribute } from './Field/ReportNumberAttribute/NumberFieldAttribute';
import ReportNumberAttribute from './Field/ReportNumberAttribute/ReportNumberAttribute';
import { RadioFieldAttribute } from './Field/ReportRadioAttribute/RadioFieldAttribute';
import ReportRadioAttribute from './Field/ReportRadioAttribute/ReportRadioAttribute';
import ReportTextAreaAttribute from './Field/ReportTextAreaAttribute/ReportTextAreaAttribute';
import { TextAreaFieldAttribute } from './Field/ReportTextAreaAttribute/TextAreaFieldAttribute';
import ReportTextAttribute from './Field/ReportTextAttribute/ReportTextAttribute';
import { TextFieldAttribute } from './Field/ReportTextAttribute/TextFieldAttribute';
import ReportTimePickerAttribute from './Field/ReportTimePickerAttribute/ReportTimePickerAttribute';
import { TimePickerFieldAttribute } from './Field/ReportTimePickerAttribute/TimePickerFieldAttribute';
import ReportPageAttribute from './Layout/ReportPageAttribute/ReportPageAttribute';
import ReportSectionAttribute from './Layout/ReportSectionAttribute/ReportSectionAttribute';
import ReportSubSectionAttribute from './Layout/ReportSubSectionAttribute/ReportSubSectionAttribute';
import { RenderComponentAttributeProps } from './ReportDefineAttributeEditor/ReportDefineAttributeEditor';
import { FormFieldType, LayoutType } from '../../../Report/FieldComponent/field-type';

export const FieldAttributeMapper = {
    [FormFieldType.Text]: (field) => new TextFieldAttribute(field),
    [FormFieldType.TextArea]: (field) => new TextAreaFieldAttribute(field),
    [FormFieldType.CodeListSelection]: (field) => new CodeListSelectionAttribute(field),
    [FormFieldType.CodeListLexicon]: (field) => new CodeListLexiconAttribute(field),
    [FormFieldType.Radio]: (field) => new RadioFieldAttribute(field),
    [FormFieldType.Number]: (field) => new NumberFieldAttribute(field),
    [FormFieldType.Checkbox]: (field) => new CheckBoxFieldAttribute(field),
    [FormFieldType.ReportDiagram]: (field) => new ReportDiagramFieldAttribute(field),
    [FormFieldType.DatePicker]: (field) => new DatePickerFieldAttribute(field),
    [FormFieldType.TimePicker]: (field) => new TimePickerFieldAttribute(field),
    [FormFieldType.Array]: (field) => new ArrayFieldAttribute(field),
    [FormFieldType.Composite]: (field) => new CompositeFieldAttribute(field),
};

type ComponentTypeMap = {
    [key: string]: ComponentType<RenderComponentAttributeProps<any>>;
};
export const ReportDefineAttributesMapper: ComponentTypeMap = {
    [LayoutType.Page]: ReportPageAttribute,
    [LayoutType.Section]: ReportSectionAttribute,
    [LayoutType.SubSection]: ReportSubSectionAttribute,
    [FormFieldType.Composite]: ReportCompositeAttribute,
    [FormFieldType.Array]: ReportArrayAttribute,
    [FormFieldType.Text]: ReportTextAttribute,
    [FormFieldType.Number]: ReportNumberAttribute,
    [FormFieldType.TextArea]: ReportTextAreaAttribute,
    [FormFieldType.CodeListSelection]: ReportCodeListSelectionAttribute,
    [FormFieldType.CodeListLexicon]: ReportCodeListLexiconAttribute,
    [FormFieldType.Radio]: ReportRadioAttribute,
    [FormFieldType.Checkbox]: ReportCheckboxAttribute,
    [FormFieldType.DatePicker]: ReportDatePickerAttribute,
    [FormFieldType.TimePicker]: ReportTimePickerAttribute,
    [FormFieldType.ReportDiagram]: ReportDiagramAttribute,
};
