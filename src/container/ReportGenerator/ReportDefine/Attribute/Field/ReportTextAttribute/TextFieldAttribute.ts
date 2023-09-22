import { TextField } from '../../../../../../interface/report-field/text-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class TextFieldAttribute extends FieldAttribute implements TextField {
    placeholder?: string;
    suffix?: string;
    prefix?: string;
    type = FormFieldType.Text;

    constructor(field: TextField) {
        super(field);

        this.suffix = field.suffix || '';
        this.prefix = field.prefix || '';
        this.placeholder = field.placeholder || '';
    }
}
