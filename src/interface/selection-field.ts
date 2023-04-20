import { Field } from './field';

export interface OptionSource<T> {
    type: string;
    source: string;
    labelKey?: string;
    key?: string;
    params?: T;
}

export interface FilterCondition {
    filterById: string;
    filterOptionKey: string;
}

export interface SelectionField<T> extends Field {
    isMulti?: boolean;
    joinStr?: string;
    optionSource: OptionSource<T>;
    filterCondition: FilterCondition;
}
