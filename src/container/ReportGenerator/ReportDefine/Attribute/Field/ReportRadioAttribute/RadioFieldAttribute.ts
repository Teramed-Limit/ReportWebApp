import { RadioField } from '../../../../../../interface/report-field/radio-field';
import {
    FilterCondition,
    OptionSource,
} from '../../../../../../interface/report-field/selection-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class RadioFieldAttribute extends FieldAttribute implements RadioField {
    filterCondition: FilterCondition;
    optionSource: OptionSource<any>;
    direction: 'row' | 'column';
    type = FormFieldType.Radio;

    constructor(field: RadioField<any>) {
        super(field);

        this.direction = field.direction || 'row';

        this.optionSource = field.optionSource || {
            type: 'http',
            source: 'string',
        };

        this.filterCondition = field.filterCondition || {
            filterById: '',
            filterOptionKey: '',
        };
    }
}
