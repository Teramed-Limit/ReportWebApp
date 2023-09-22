import React from 'react';

import classes from './BaseNativeSelection.module.scss';

interface Props {
    id?: string;
    disabled?: boolean;
    options: { label: string; value: string | number }[];
    value: string;
    prefix?: string;
    suffix?: string;
    onValueChange: (options: any) => void;
    customClass?: string;
}

const BaseNativeSelection = ({
    id,
    disabled = false,
    value = '',
    onValueChange,
    options,
    prefix,
    suffix,
    customClass,
}: Props) => {
    return (
        <div className={classes.container}>
            <span>{prefix}</span>
            <select
                id={id}
                disabled={disabled}
                className={customClass || classes[`text-input`]}
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <span>{suffix}</span>
        </div>
    );
};

export default BaseNativeSelection;
