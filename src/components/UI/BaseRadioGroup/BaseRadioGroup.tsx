import React from 'react';

import { RadioGroup } from '@mui/material';

import { CodeList } from '../../../interface/code-list';
import BaseRadio from '../BaseRadio/BaseRadio';

interface Props {
    id: string;
    value: string;
    options: CodeList[];
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
                        key={option.Id}
                        label={option.Label}
                        value={option.Value}
                    />
                );
            })}
        </RadioGroup>
    );
};

export default BaseRadioGroup;
