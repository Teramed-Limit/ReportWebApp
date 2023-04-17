import { Style } from '@react-pdf/types/style';

import { Validate } from './validate';

export interface Field {
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
}

export interface ButtonMeta {
    id: string;
    label: string;
    action: string;
    actionParams?: any;
    hide?: boolean;
    disable?: string;
}
