import React, { ForwardedRef, forwardRef } from 'react';

import classes from './BaseTextArea.module.scss';

interface Props {
    id?: string;
    value: string;
    rows?: number;
    disabled?: boolean;
    maxLength?: number;
    onValueChange: (str: string) => void;
    onFocusChange?: () => void;
}

const BaseTextArea = forwardRef(
    (
        {
            id,
            value = '',
            rows = 6,
            maxLength = 5000,
            disabled = false,
            onValueChange,
            onFocusChange = () => {},
        }: Props,
        ref: ForwardedRef<HTMLTextAreaElement>,
    ) => {
        const handleChange = (event) => {
            onValueChange(event.target.value.substring(0, maxLength));
        };

        return (
            <textarea
                ref={ref}
                id={id}
                autoComplete="off"
                disabled={disabled}
                className={classes.textareaInput}
                maxLength={maxLength}
                tabIndex={0}
                rows={rows}
                value={value}
                onClick={(event) => event.stopPropagation()}
                onChange={handleChange}
                onFocus={() => onFocusChange()}
            />
        );
    },
);

export default BaseTextArea;
