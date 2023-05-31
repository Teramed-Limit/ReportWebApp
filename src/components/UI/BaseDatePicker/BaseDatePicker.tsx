import React from 'react';

import { format, isMatch, parse } from 'date-fns';

import classes from './BaseDatePicker.module.scss';
import { isEmptyOrNil } from '../../../utils/general';

interface Props {
    id?: string;
    value: string;
    disabled?: boolean;
    onValueChange: (str: string) => void;
    onKeyPress?: (event) => void;
    suffix?: string;
    prefix?: string;
    customClass?: string;
    toFormat?: string;
    fromFormat?: string;
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
    toFormat = 'yyyy-MM-dd',
    fromFormat = 'yyyyMMdd',
}: Props) => {
    // Convert value to format
    const isMatchFormat = isMatch(value, toFormat);
    let toValue = value;
    if (!isMatchFormat && !isEmptyOrNil(value)) {
        const fromValue = parse(value, fromFormat, new Date());
        if (!Number.isNaN(fromValue.getTime())) toValue = format(fromValue, toFormat);
    }

    const handleValueChange = (targetValue: string) => {
        const fromValue = parse(targetValue, 'yyyy-MM-dd', new Date());
        const result = format(fromValue, toFormat);
        onValueChange(result);
    };

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
                value={toValue}
                onChange={(event) => handleValueChange(event.target.value)}
                onKeyPressCapture={(event) => onKeyPress(event)}
            />
            <span>{suffix}</span>
        </div>
    );
};

export default BaseDatePicker;
