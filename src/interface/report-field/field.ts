import { Style } from '@react-pdf/types/style';

import { FormFieldType } from '../../container/Report/FieldComponent/field-type';
import { Validate } from '../validate';

export interface BaseField {
    id: string;
    label?: string;
    labelWidth: string;
    type: FormFieldType;
    orientation: 'column' | 'row';
    hint?: string;
    hideLabel?: boolean;
    labelStyle?: Style;
}

export interface Field<T = any, R = any> extends BaseField {
    // 初始值
    defaultValue?: string;
    // 和哪個Id的欄位做連動
    initMapping?: string;
    readOnly?: boolean;
    suffix?: string;
    prefix?: string;
    buttonBar?: ButtonMeta<R>[];
    validate?: Validate;
    fromModal?: string;
    valueStyle?: Style;
    valueChangedEvent?: ValueChangedEvent<T>;
}

export interface ValueChangedEvent<T> {
    event: string;
    eventParams: T;
}

export interface ButtonMeta<T = any> {
    id: string;
    label: string;
    action: string;
    actionParams?: T;
    hide?: boolean;
    disable?: boolean;
}
