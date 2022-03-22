import React from 'react';

import BaseNumber from '../../../../components/UI/BaseNumber/BaseNumber';
import { Field } from '../../../../interface/field';

interface Props {
    field: Field;
    value: string;
    onValueChange: (value: number) => void;
    disabled: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NumberInput = React.forwardRef(({ field, value, onValueChange, disabled }: Props, ref) => {
    return (
        <BaseNumber
            id={field.id}
            disabled={disabled || field.readOnly}
            value={value}
            onValueChange={onValueChange}
            prefix={field.prefix}
            suffix={field.suffix}
        />
    );
});

export default NumberInput;
