import React, { ForwardedRef } from 'react';

import BaseDatePicker from '../../../../components/UI/BaseDatePicker/BaseDatePicker';
import { Field } from '../../../../interface/field';

interface Props {
    field: Field;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

const DatePicker = React.forwardRef(
    ({ field, value, onValueChange, disabled }: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
        return (
            <BaseDatePicker
                id={field.id}
                disabled={disabled || field.readOnly}
                value={value}
                onValueChange={onValueChange}
                prefix={field.prefix}
                suffix={field.suffix}
            />
        );
    },
);

export default DatePicker;
