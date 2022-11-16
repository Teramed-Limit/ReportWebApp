import React, { CSSProperties, ForwardedRef, forwardRef } from 'react';

import { TextareaAutosize } from '@mui/material';

import classes from './BaseTextArea.module.scss';

interface Props {
    id?: string;
    style?: CSSProperties;
    value: string;
    rows?: number;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    onValueChange: (str: string) => void;
    onFocusChange?: () => void;
}

const BaseTextArea = forwardRef(
    (
        {
            id,
            style,
            value = '',
            placeholder = '',
            rows = 4,
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
            <TextareaAutosize
                ref={ref}
                id={id}
                style={style}
                placeholder={placeholder}
                autoComplete="off"
                disabled={disabled}
                className={classes.textareaInput}
                maxLength={maxLength}
                tabIndex={0}
                minRows={rows}
                value={value}
                onClick={(event) => event.stopPropagation()}
                onChange={handleChange}
                onFocus={() => onFocusChange()}
            />
        );
    },
);

export default BaseTextArea;
