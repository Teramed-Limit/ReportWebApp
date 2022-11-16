import { Field } from './field';

export interface CompositeField extends Field {
    compositeOrientation: 'column' | 'row';
    fields: Field[];
}
