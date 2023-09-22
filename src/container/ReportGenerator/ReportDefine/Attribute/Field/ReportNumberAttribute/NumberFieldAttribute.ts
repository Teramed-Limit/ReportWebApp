import { TextField } from '../../../../../../interface/report-field/text-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

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
