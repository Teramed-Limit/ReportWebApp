import React, { useEffect, useRef, useState } from 'react';

import { TextField } from '@mui/material';

import { FormField } from '../../../../interface/form-editor-define';
import { ValidationMessage } from '../validationMapper';

interface Props {
    field: FormField;
    value: string;
    isValid: boolean;
    autoFocus: boolean;
    readOnly?: boolean;
    onValueChanged: (value: string, fieldId: string) => void;
}

const TextareaEdit = ({
    field,
    value,
    isValid,
    autoFocus,
    readOnly = false,
    onValueChanged,
}: Props) => {
    const [isDirty, setDirty] = useState(false);
    const [validationMsg] = useState(
        field.validate ? `- ${ValidationMessage[field.validate?.type]}` : '',
    );
    const ref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        ref.current?.setAttribute('spellCheck', 'false');
    }, []);

    return (
        <>
            <TextField
                fullWidth
                multiline
                spellCheck={false}
                label={`${field.label} ${validationMsg}`}
                disabled={readOnly}
                placeholder="Empty"
                value={value || ''}
                autoFocus={autoFocus}
                id={field.id}
                error={!isValid && isDirty}
                onChange={(e) => {
                    onValueChanged(e.target.value, field.id);
                    setDirty(true);
                }}
            />
        </>
    );
};

export default React.memo(TextareaEdit);
