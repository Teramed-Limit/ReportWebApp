import { CheckboxField } from '../../../../../../interface/report-field/checkbox-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class CheckBoxFieldAttribute extends FieldAttribute implements CheckboxField {
    checkboxLabel: string;
    type = FormFieldType.Checkbox;

    constructor(field: CheckboxField) {
        super(field);
        this.checkboxLabel = field.checkboxLabel || '';
    }
}
