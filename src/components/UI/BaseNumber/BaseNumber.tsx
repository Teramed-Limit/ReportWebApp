import React from 'react';

import classes from './BaseNumber.module.scss';

interface Props {
    id?: string;
    value: string;
    disabled?: boolean;
    onValueChange: (num: number) => void;
    suffix?: string;
    prefix?: string;
    customClass?: string;
}

const BaseNumber = ({
    id,
    value,
    disabled = false,
    onValueChange,
    suffix,
    prefix,
    customClass,
}: Props) => {
    return (
        <div className={classes.container}>
            <span>{prefix}</span>
            <input
                id={id}
                disabled={disabled}
                className={customClass || classes[`text-input`]}
                type="number"
                tabIndex={0}
                value={Number(value).toString()}
                onChange={(event) => onValueChange(+event.target.value)}
            />
            <span>{suffix}</span>
        </div>
    );
};

export default BaseNumber;
