import React from 'react';

import classes from './BaseTextInput.module.scss';

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

const BaseTextInput = ({
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
                type="text"
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

export default BaseTextInput;
