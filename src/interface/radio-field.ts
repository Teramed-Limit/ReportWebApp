import { Field } from './field';
import { FilterCondition, OptionSource } from './selection-field';

export interface RadioField<T> extends Field {
    optionSource: OptionSource<T>;
    filterCondition: FilterCondition;
}
