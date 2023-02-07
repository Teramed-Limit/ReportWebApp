import { Field } from './field';
import { FilterCondition, OptionSource } from './selection-field';

export interface LexiconField<T> extends Field {
    maxLength: number;
    optionSource: OptionSource<T>;
    filterCondition: FilterCondition;
}

export interface AsyncLexiconField<T> extends Field {
    maxLength: number;
    termId: string;
    optionSource: OptionSource<T>;
}
