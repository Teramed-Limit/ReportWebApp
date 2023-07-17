import { FieldAttribute } from './FieldAttribute';
import { TextField } from '../../../../interface/text-field';
import { FormFieldType } from '../../../Report/field/field-type';

export class NumberFieldAttribute extends FieldAttribute implements TextField {
    placeholder?: string;
    suffix?: string;
    prefix?: string;
    type = FormFieldType.Number;

    constructor(field: TextField) {
        super(field);

        this.suffix = field.suffix || '';
        this.prefix = field.prefix || '';
        this.placeholder = field.placeholder || '';
    }
}
