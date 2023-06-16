import { Field } from './field';

export interface DateField extends Field {
    defaultToday?: boolean;
    fromFormat?: string;
    toFormat?: string;
}
