import { TextField } from '../../../../interface/text-field';
import { FormFieldType } from '../../../Report/field/field-type';
import { FieldAttribute } from './FieldAttribute';

export class DatePickerFieldAttribute extends FieldAttribute implements TextField {
    placeholder?: string;
    suffix?: string;
    prefix?: string;
    type = FormFieldType.DatePicker;

    constructor(field: TextField) {
        super(field);

        this.suffix = field.suffix || '';
        this.prefix = field.prefix || '';
        this.placeholder = field.placeholder || '';
    }
}
