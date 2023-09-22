import { DateField } from '../../../../../../interface/report-field/date-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class DatePickerFieldAttribute extends FieldAttribute implements DateField {
    type = FormFieldType.DatePicker;
    defaultToday?: boolean;
    fromFormat?: string;
    toFormat?: string;

    constructor(field: DateField) {
        super(field);

        this.defaultToday = field.defaultToday || false;
        this.fromFormat = field.fromFormat || '';
        this.toFormat = field.toFormat || '';
    }
}
