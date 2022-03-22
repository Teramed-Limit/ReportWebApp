import React from 'react';

import BaseCheckbox from '../../../../components/UI/BaseCheckbox/BaseCheckbox';
import { CheckboxField } from '../../../../interface/checkbox-field';

interface Props {
    field: CheckboxField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Checkbox = React.forwardRef(({ field, value, onValueChange, disabled }: Props, ref) => {
    const onChecked = (isCheck: boolean) => onValueChange(isCheck ? '1' : '0');
    return (
        <BaseCheckbox
            id={field.id}
            disabled={disabled || field.readOnly}
            label={field.checkboxLabel}
            value={!!+value}
            onValueChange={onChecked}
        />
    );
});

export default Checkbox;
