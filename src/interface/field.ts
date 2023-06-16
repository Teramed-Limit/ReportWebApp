import { Style } from '@react-pdf/types/style';

import { Validate } from './validate';
import { FormFieldType } from '../container/Report/field/field-type';

export interface Field<T = any> {
    id: string;
    label?: string;
    defaultValue?: string;
    initMapping?: string;
    type: FormFieldType;
    size?: string;
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
    valueChangedEvent?: ValueChangedEvent<T>;
}

export interface ValueChangedEvent<T> {
    event: string;
    eventParams: T;
}

export interface ButtonMeta {
    id: string;
    label: string;
    action: string;
    actionParams?: any;
    hide?: boolean;
    disable?: string;
}
