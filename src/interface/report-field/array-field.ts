import { CompositeField } from './composite-field';
import { BaseField, ButtonMeta, Field } from './field';

export interface ArrayField extends BaseField {
    buttonBar?: ButtonMeta[];
    arrayOrientation?: 'column' | 'row';
    templateField: Field | CompositeField;
}

// 排除 labelWidth
export type ArrayFieldType = Omit<ArrayField, 'labelWidth'>;
