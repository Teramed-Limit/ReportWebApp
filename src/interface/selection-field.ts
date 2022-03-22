import { Field } from './field';

export interface OptionSource<T> {
    type: string;
    source: string;
    format?: string;
    key?: string;
    params?: T;
}

export interface FilterCondition {
    filterById: string;
    filterOptionKey: string;
}

export interface SelectionField<T> extends Field {
    isMulti?: boolean;
    optionSource: OptionSource<T>;
    filterCondition: FilterCondition;
}
