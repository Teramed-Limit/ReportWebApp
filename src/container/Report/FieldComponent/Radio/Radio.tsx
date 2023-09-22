import React, { useEffect } from 'react';

import BaseRadioGroup from '../../../../components/UI/BaseRadioGroup/BaseRadioGroup';
import { RadioField } from '../../../../interface/report-field/radio-field';
import { useOptionStore } from '../../../../models/useStore';

interface Props {
    field: RadioField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Radio = React.forwardRef(({ field, value, onValueChange, disabled }: Props, ref) => {
    const options = useOptionStore().getCodeList(field.optionSource, field.filterCondition);

    const onChecked = (isCheck: string) => onValueChange(isCheck);

    // Assign default value
    useEffect(() => {
        if (!value && options && options.length > 0) {
            onValueChange(options[0].Value);
        }
    }, [onValueChange, options, value]);

    return (
        <BaseRadioGroup
            id={field.id}
            disabled={disabled}
            row={field.direction !== 'column'}
            value={value}
            options={options || []}
            onChecked={onChecked}
        />
    );
});

export default Radio;
