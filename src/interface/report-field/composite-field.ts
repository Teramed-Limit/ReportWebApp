import { Style } from '@react-pdf/types/style';

import { BaseField, ButtonMeta } from './field';
import { Validate } from '../validate';

export interface CompositeField extends BaseField {
    compositeOrientation: 'column' | 'row';
    fields: InnerCompositeField[];
}

export interface InnerCompositeField extends BaseField {
    readOnly: boolean;
    initMapping?: string;
    validate?: Validate;
    valueStyle: Style;
    buttonBar?: ButtonMeta[];
}
