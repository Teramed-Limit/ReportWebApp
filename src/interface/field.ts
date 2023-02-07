import { Style } from '@react-pdf/types/style';

import { FormFieldType } from '../container/Report/field/field-type';
import { Validate } from './validate';

export interface Field {
    id: string;
    label?: string;
    type: FormFieldType;
    readOnly?: boolean;
    orientation: 'column' | 'row';
    buttonBar?: ButtonMeta[];
    suffix?: string;
    prefix?: string;
    validate?: Validate;
    hint?: string;
    hide?: boolean;
    hideLabel?: boolean;
    fromModal?: string;
    labelStyle?: Style;
    valueStyle?: Style;
}

export interface ButtonMeta {
    id: string;
    label: string;
    action: string;
    actionParams?: any;
    hide?: boolean;
    disable?: string;
}
