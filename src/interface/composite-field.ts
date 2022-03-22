import { Field } from './field';

export interface CompositeField extends Field {
    fields: Field[];
}
