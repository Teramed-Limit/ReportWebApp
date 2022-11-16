import React from 'react';

import classes from './BaseDatePicker.module.scss';

interface Props {
    id?: string;
    value: string;
    disabled?: boolean;
    onValueChange: (str: string) => void;
    onKeyPress?: (event) => void;
    suffix?: string;
    prefix?: string;
    customClass?: string;
}

const BaseDatePicker = ({
    id,
    value = '',
    disabled = false,
    onValueChange,
    onKeyPress = () => {},
    suffix,
    prefix,
    customClass,
}: Props) => {
    return (
        <div className={classes.container}>
            <span>{prefix}</span>
            <input
                autoComplete="off"
                id={id}
                disabled={disabled}
                className={customClass || classes[`text-input`]}
                type="date"
                tabIndex={0}
                maxLength={200}
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                onKeyPressCapture={(event) => onKeyPress(event)}
            />
            <span>{suffix}</span>
        </div>
    );
};

export default BaseDatePicker;
