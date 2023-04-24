import { Field } from './field';
import { FilterCondition, OptionSource } from './selection-field';

export interface RadioField<T = any> extends Field {
    optionSource: OptionSource<T>;
    filterCondition: FilterCondition;
    direction?: 'row' | 'column';
}
