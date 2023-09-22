import React from 'react';

import classes from './PercentageNumber.module.scss';

interface Props {
    id?: string;
    value: string;
    disabled?: boolean;
    onValueChange: (num: string) => void;
    customClass?: string;
}

const PercentageNumber = ({ id, value, disabled = false, onValueChange, customClass }: Props) => {
    return (
        <div className={classes.container}>
            <input
                id={id}
                disabled={disabled}
                className={customClass || classes[`text-input`]}
                type="number"
                tabIndex={0}
                value={Number(value.replace('%', ''))}
                onChange={(event) => onValueChange(`${+event.target.value}%`)}
            />
            <span>%</span>
        </div>
    );
};

export default PercentageNumber;
