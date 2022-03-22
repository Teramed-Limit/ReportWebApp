import React, { useEffect } from 'react';

import BaseRadio from '../../UI/BaseRadio/BaseRadio';

interface Props {
    id: string;
    value: string;
    onChange?: (string: string) => void;
    optionList: { value: string; label: string }[];
    disabled: boolean;
}

const RadioGroup = ({ id, value, onChange, optionList, disabled }: Props) => {
    const [state, setState] = React.useState<string>(value);

    useEffect(() => {
        setState(value);
    }, [value]);

    function handleOnChange(selected: string) {
        setState(selected);
        onChange?.(selected);
    }

    return (
        <>
            {optionList.map((option) => (
                <div key={option.label}>
                    <BaseRadio
                        id={`${id}__${option.label}`}
                        disabled={disabled}
                        checked={option.value === state}
                        value={option.value}
                        label={option.label}
                        onCheck={handleOnChange}
                    />
                </div>
            ))}
        </>
    );
};

export default RadioGroup;
