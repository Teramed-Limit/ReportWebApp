import React, { useState } from 'react';

import { TextField } from '@mui/material';

import { Field } from '../../../../interface/field';
import { ValidationMessage } from '../validationMapper';

interface Props {
    field: Field;
    value: string;
    isValid: boolean;
    autoFocus: boolean;
    readOnly?: boolean;
    onValueChanged: (value: number, fieldId: string) => void;
}

const NumberEdit = ({
    field,
    value,
    isValid,
    autoFocus,
    readOnly = false,
    onValueChanged,
}: Props) => {
    const [isDirty, setDirty] = useState(false);
    const [validationMsg] = useState(
        field.validate ? `- ${ValidationMessage[field.validate.type]}` : '',
    );

    return (
        <TextField
            fullWidth
            type="number"
            autoFocus={autoFocus}
            disabled={readOnly}
            label={`${field.label} ${validationMsg}`}
            id={field.id}
            value={value || ''}
            onChange={(e) => {
                onValueChanged(+e.target.value, field.id);
                setDirty(true);
            }}
            error={!isValid && isDirty}
            size="small"
        />
    );
};

export default React.memo(NumberEdit);
