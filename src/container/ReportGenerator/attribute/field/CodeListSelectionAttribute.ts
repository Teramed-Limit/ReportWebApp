import {
    FilterCondition,
    OptionSource,
    SelectionField,
} from '../../../../interface/selection-field';
import { FormFieldType } from '../../../Report/field/field-type';
import { FieldAttribute } from './FieldAttribute';

export class CodeListSelectionAttribute extends FieldAttribute implements SelectionField<any> {
    isMulti?: boolean;
    optionSource: OptionSource<any>;
    filterCondition: FilterCondition;
    type = FormFieldType.CodeListSelection;

    constructor(field: SelectionField<any>) {
        super(field);

        this.isMulti = field.isMulti || false;
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
