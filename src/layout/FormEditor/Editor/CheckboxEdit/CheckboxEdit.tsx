import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { FormField } from '../../../../interface/form-editor-define';

interface Props {
    field: FormField;
    value: boolean;
    readOnly?: boolean;
    onValueChanged: (value: boolean, fieldId: string) => void;
}

const CheckboxEdit = ({ field, value, onValueChanged, readOnly = false }: Props) => {
    return (
        <FormControlLabel
            sx={{ margin: '0px' }}
            control={
                <Checkbox
                    id={field.id}
                    size="small"
                    disabled={readOnly}
                    checked={value || false}
                    onChange={(e) => {
                        onValueChanged(e.target.checked, field.id);
                    }}
                />
            }
            label={field.label || ''}
        />
    );
};

export default CheckboxEdit;
