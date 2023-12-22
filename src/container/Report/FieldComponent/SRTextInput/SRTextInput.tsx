import React, { useEffect } from 'react';

import BaseTextInput from '../../../../components/UI/BaseTextInput/BaseTextInput';
import { SRTextField } from '../../../../interface/report-field/sr-text-field';
import { isEmptyOrNil } from '../../../../utils/general';

interface Props {
    field: SRTextField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SRTextInput = React.forwardRef(({ field, value, onValueChange, disabled }: Props, ref) => {
    useEffect(() => {
        if (field?.defaultValue && isEmptyOrNil(value)) onValueChange(field.defaultValue);
    }, [field.defaultValue, onValueChange, value]);
    return (
        <BaseTextInput
            id={field.id}
            placeholder={field?.placeholder || ''}
            disabled={disabled || field.readOnly}
            value={value}
            onValueChange={onValueChange}
            prefix={field.prefix}
            suffix={field.suffix}
        />
    );
});

export default SRTextInput;
