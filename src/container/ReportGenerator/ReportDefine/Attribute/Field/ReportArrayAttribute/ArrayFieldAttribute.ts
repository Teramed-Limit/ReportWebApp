import { ArrayFieldType } from '../../../../../../interface/report-field/array-field';
import { CompositeField } from '../../../../../../interface/report-field/composite-field';
import { Field } from '../../../../../../interface/report-field/field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { TextFieldAttribute } from '../ReportTextAttribute/TextFieldAttribute';

export class ArrayFieldAttribute implements ArrayFieldType {
    id: string;
    type: FormFieldType;
    orientation: 'column' | 'row';
    arrayOrientation: 'column' | 'row';
    templateField: Field | CompositeField;

    constructor(field: ArrayFieldType) {
        this.id = field.id || `ArrayField-${new Date().getTime()}`;
        this.type = FormFieldType.Array;
        this.orientation = field.orientation || 'column';
        this.arrayOrientation = field.arrayOrientation || 'row';
        this.templateField =
            field.templateField ||
            new TextFieldAttribute({
                id: `TemplateField-${new Date().getTime()}`,
                label: 'Label',
                labelWidth: '35%',
                orientation: 'row',
                type: FormFieldType.Text,
            });
    }
}
