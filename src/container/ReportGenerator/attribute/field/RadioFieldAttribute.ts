import { FieldAttribute } from './FieldAttribute';
import { RadioField } from '../../../../interface/radio-field';
import { FilterCondition, OptionSource } from '../../../../interface/selection-field';
import { FormFieldType } from '../../../Report/field/field-type';

export class RadioFieldAttribute extends FieldAttribute implements RadioField<any> {
    filterCondition: FilterCondition;
    optionSource: OptionSource<any>;
    type = FormFieldType.Radio;

    constructor(field: RadioField<any>) {
        super(field);

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
