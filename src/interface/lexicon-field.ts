import { Field } from './field';
import { FilterCondition, OptionSource } from './selection-field';

export interface LexiconField<T> extends Field {
    optionSource: OptionSource<T>;
    filterCondition: FilterCondition;
}

export interface AsyncLexiconField<T> extends Field {
    termId: string;
    optionSource: OptionSource<T>;
}
