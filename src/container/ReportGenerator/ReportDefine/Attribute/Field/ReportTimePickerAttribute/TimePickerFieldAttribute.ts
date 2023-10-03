import { TimeField } from '../../../../../../interface/report-field/time-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class TimePickerFieldAttribute extends FieldAttribute implements TimeField {
    type = FormFieldType.TimePicker;
    defaultNow?: boolean;

    constructor(field: TimeField) {
        super(field);
        this.defaultNow = field.defaultNow || false;
    }
}
