import { FormFieldType } from '../../../Report/field/field-type';
import { ArrayFieldAttribute } from './ArrayFieldAttribute';
import { CheckBoxFieldAttribute } from './CheckBoxFieldAttribute';
import { CodeListLexiconAttribute } from './CodeListLexiconAttribute';
import { CodeListSelectionAttribute } from './CodeListSelectionAttribute';
import { CompositeFieldAttribute } from './CompositeFieldAttribute';
import { DatePickerFieldAttribute } from './DatePickerFieldAttribute';
import { NumberFieldAttribute } from './NumberFieldAttribute';
import { RadioFieldAttribute } from './RadioFieldAttribute';
import { ReportDiagramFieldAttribute } from './ReportDiagramFieldAttribute';
import { TextAreaFieldAttribute } from './TextAreaFieldAttribute';
import { TextFieldAttribute } from './TextFieldAttribute';

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
    [FormFieldType.Array]: (field) => new ArrayFieldAttribute(field),
    [FormFieldType.Composite]: (field) => new CompositeFieldAttribute(field),
};
