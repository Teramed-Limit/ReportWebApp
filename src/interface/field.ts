import { Style } from '@react-pdf/types/style';

import { Validate } from './validate';

export interface Field<T = any> {
    id: string;
    label?: string;
    defaultValue?: string;
    type: string;
    size?: string;
    readOnly?: boolean;
    orientation: 'column' | 'row';
    multiple?: boolean;
    buttonBar?: ButtonMeta[];
    suffix?: string;
    prefix?: string;
    validate?: Validate;
    hint?: string;
    hide?: boolean;
    hideLabel?: boolean;
    fromModal?: string;
    maxLength?: number;
    placeholder?: string;
    labelStyle?: Style;
    valueStyle?: Style;
    valueChangedEvent?: ValueChangedEvent<T>;
}

interface ValueChangedEvent<T> {
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
