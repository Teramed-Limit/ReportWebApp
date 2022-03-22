import React from 'react';

import { FormControlLabel, Radio } from '@material-ui/core';

import classes from './BaseRadio.module.scss';

interface Props {
    id?: string;
    value: any;
    label: string;
    onCheck?: (string: string) => void;
    checked?: boolean;
    disabled?: boolean;
}

const BaseRadio = ({ id, value, label, checked, onCheck, disabled = false }: Props) => {
    return (
        <FormControlLabel
            disabled={disabled}
            classes={{ root: classes.formControlLabelRoot }}
            value={value}
            control={
                <Radio
                    id={id}
                    checked={checked}
                    classes={{ root: classes.radioRoot }}
                    size="small"
                    color="primary"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        onCheck?.(event.target.value)
                    }
                />
            }
            label={label}
            labelPlacement="end"
        />
    );
};

export default BaseRadio;
