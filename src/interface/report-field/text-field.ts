import { Field } from './field';

export interface TextField extends Field {
    placeholder?: string;
    suffix?: string;
    prefix?: string;
}
