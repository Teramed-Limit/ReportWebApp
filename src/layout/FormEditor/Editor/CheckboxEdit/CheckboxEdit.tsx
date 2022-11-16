import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { FormField } from '../../../../interface/form-editor-define';

interface Props {
    field: FormField;
    value: number;
    readOnly?: boolean;
    onValueChanged: (value: number, fieldId: string) => void;
}

const CheckboxEdit = ({ field, value, onValueChanged, readOnly = false }: Props) => {
    return (
        <FormControlLabel
            sx={{ margin: '0px' }}
            control={
                <Checkbox
                    size="small"
                    disabled={readOnly}
                    checked={value === 1}
                    onChange={(e) => {
                        onValueChanged(e.target.checked ? 1 : 0, field.id);
                    }}
                />
            }
            label={field.label || ''}
        />
    );
};

export default CheckboxEdit;
