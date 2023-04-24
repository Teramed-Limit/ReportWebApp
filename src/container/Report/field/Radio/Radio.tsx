import React, { useEffect } from 'react';

import BaseRadioGroup from '../../../../components/UI/BaseRadioGroup/BaseRadioGroup';
import { RadioField } from '../../../../interface/radio-field';
import { useOptionStore } from '../../../../models/useStore';

interface Props {
    field: RadioField<any>;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Radio = React.forwardRef(({ field, value, onValueChange, disabled }: Props, ref) => {
    const { optionSource, filterCondition } = field;
    const { source } = optionSource;

    const options = useOptionStore().getCodeList(source, filterCondition);

    const onChecked = (isCheck: string) => onValueChange(isCheck);

    // Assign default value
    useEffect(() => {
        if (value === undefined && options && options.length > 0) {
            onValueChange(options[0].Value);
        }
    }, [onValueChange, options, value]);

    if (!value) return <></>;

    return (
        <BaseRadioGroup
            id={field.id}
            disabled={disabled}
            row={field.direction === 'column' || true}
            value={value}
            options={options || []}
            onChecked={onChecked}
        />
    );
});

export default Radio;
