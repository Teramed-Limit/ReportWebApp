import { Field } from './field';
import { OptionSource } from './selection-field';

export interface LexiconField<T> extends Field {
    optionSource: OptionSource<T>;
}

export interface AsyncLexiconField<T> extends Field {
    termId: string;
    optionSource: OptionSource<T>;
}
