import { SRTextField } from '../../../../../../interface/report-field/sr-text-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class SRTextFieldAttribute extends FieldAttribute implements SRTextField {
    placeholder?: string;
    suffix?: string;
    prefix?: string;
    structureReportPath?: string;
    daysToWeeks?: boolean;
    formula?: string;
    type = FormFieldType.SRText;

    constructor(field: SRTextField) {
        super(field);

        this.suffix = field.suffix || '';
        this.prefix = field.prefix || '';
        this.structureReportPath = field.structureReportPath || '';
        this.daysToWeeks = field.daysToWeeks || false;
        this.formula = field.formula || '';
        this.placeholder = field.placeholder || '';
    }
}
