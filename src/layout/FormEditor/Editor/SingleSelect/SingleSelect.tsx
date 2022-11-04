import React, { useState } from 'react';

import { MenuItem, MenuProps, TextField } from '@mui/material';

import { useSelectOptions } from '../../../../hooks/useSelectOptions';
import { FormSelectionField } from '../../../../interface/form-editor-define';
import { ValidationMessage } from '../validationMapper';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const menuProps: Partial<MenuProps> = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    transitionDuration: 0,
};

interface Props {
    field: FormSelectionField;
    value: string;
    readOnly?: boolean;
    autoFocus: boolean;
    isValid: boolean;
    onValueChanged: (value: any, fieldId: string) => void;
}

const SingleSelect = ({
    field,
    value,
    autoFocus,
    isValid,
    onValueChanged,
    readOnly = false,
}: Props) => {
    const [isDirty, setDirty] = useState(false);
    const [validationMsg] = useState(
        field.validate ? `- ${ValidationMessage[field.validate?.type]}` : '',
    );
    const { options } = useSelectOptions(field.optionSource.type, field.optionSource.source);

    const handleChange = (event) => {
        setDirty(true);
        onValueChanged(event.target.value, field.id);
    };

    return (
        <>
            {options.length > 0 && (
                <TextField
                    disabled={readOnly}
                    autoFocus={autoFocus}
                    fullWidth
                    size="small"
                    label={`${field.label} ${validationMsg}`}
                    select
                    value={value || ''}
                    error={!isValid && isDirty}
                    onChange={handleChange}
                    SelectProps={{ MenuProps: menuProps }}
                >
                    <MenuItem value="">
                        <em>- None -</em>
                    </MenuItem>
                    {options.map((item) => {
                        const optionLabel = field.optionSource.labelKey
                            ? item[field.optionSource.labelKey]
                            : item;
                        const optionKey = field.optionSource.key
                            ? item[field.optionSource.key]
                            : item;
                        return (
                            <MenuItem key={optionKey} value={optionKey}>
                                {optionLabel}
                            </MenuItem>
                        );
                    })}
                </TextField>
            )}
        </>
    );
};

export default React.memo(SingleSelect);
