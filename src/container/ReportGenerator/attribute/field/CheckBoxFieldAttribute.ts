import { FieldAttribute } from './FieldAttribute';
import { CheckboxField } from '../../../../interface/checkbox-field';
import { FormFieldType } from '../../../Report/field/field-type';

export class CheckBoxFieldAttribute extends FieldAttribute implements CheckboxField {
    checkboxLabel: string;
    type = FormFieldType.Checkbox;

    constructor(field: CheckboxField) {
        super(field);
        this.checkboxLabel = field.checkboxLabel || '';
    }
}
