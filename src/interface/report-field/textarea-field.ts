import { Field } from './field';

export interface TextareaField extends Field {
    placeholder?: string;
    rows?: number;
    maxLength?: number;
}
