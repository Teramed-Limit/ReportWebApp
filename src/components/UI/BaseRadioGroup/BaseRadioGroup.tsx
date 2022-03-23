import React from 'react';

import { RadioGroup } from '@mui/material';

import { Option } from '../../../interface/option';
import BaseRadio from '../BaseRadio/BaseRadio';

interface Props {
    id: string;
    value: string;
    options: Option[];
    onChecked: (value: string) => void;
    disabled: boolean;
}

const BaseRadioGroup = ({ id, options, value, onChecked, disabled }: Props) => {
    const onSelectChange = (event: React.ChangeEvent<HTMLInputElement>, selection: string) => {
        onChecked(selection);
    };

    return (
        <RadioGroup row defaultValue="1" id={id} value={value} onChange={onSelectChange}>
            {options.map((option) => {
                return (
                    <BaseRadio
                        disabled={disabled}
                        key={option.Code}
                        label={option.Code}
                        value={option.Name}
                    />
                );
            })}
        </RadioGroup>
    );
};

export default BaseRadioGroup;
