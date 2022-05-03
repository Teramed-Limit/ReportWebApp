import { Validate } from './validate';

export interface Field {
    id: string;
    label?: string;
    type: string;
    size?: string;
    readOnly?: boolean;
    orientation?: string;
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
}

export interface ButtonMeta {
    id: string;
    label: string;
    action: string;
    actionParams?: any;
    hide?: boolean;
    disable?: string;
}
