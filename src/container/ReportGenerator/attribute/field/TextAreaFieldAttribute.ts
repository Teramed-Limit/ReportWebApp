import { FieldAttribute } from './FieldAttribute';
import { TextareaField } from '../../../../interface/textarea-field';
import { FormFieldType } from '../../../Report/field/field-type';

export class TextAreaFieldAttribute extends FieldAttribute implements TextareaField {
    rows?: number;
    maxLength?: number;
    placeholder?: string;
    type = FormFieldType.TextArea;

    constructor(field: TextareaField) {
        super(field);

        this.rows = field.rows || 4;
        this.placeholder = field.placeholder || '';
        this.maxLength = field.maxLength || 1000;
    }
}
