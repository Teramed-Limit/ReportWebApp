import React, { useEffect, useState } from 'react';

import { Stack, TextField } from '@mui/material';

import { Field } from '../../../../interface/field';
import { ValidationMessage } from '../validationMapper';

interface Props {
    field: Field;
    value: string;
    isValid: boolean;
    autoFocus: boolean;
    readOnly?: boolean;
    onValueChanged: (value: string, fieldId: string) => void;
}

const ImageSelectEdit = ({
    field,
    value,
    isValid,
    autoFocus,
    readOnly = false,
    onValueChanged,
}: Props) => {
    const [isDirty, setDirty] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>(value);
    const [validationMsg] = useState(
        field.validate ? `- ${ValidationMessage[field.validate?.type]}` : '',
    );

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    useEffect(() => {
        if (/^(f|ht)tps?:\/\//i.test(value)) {
            setImageSrc(value);
            return;
        }
        setImageSrc(`data:image/jpg;base64, ${value}`);
    }, [value]);

    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <TextField
                style={{ flex: '1' }}
                autoFocus={autoFocus}
                disabled={readOnly}
                type="file"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{ accept: 'image/*' }}
                label={`${field.label} ${validationMsg}`}
                id={field.id}
                error={!isValid && isDirty}
                size="small"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files) return;
                    const base64 = (await convertBase64(e.target.files[0])) as string;
                    onValueChanged(base64.replace(/^data:image\/\w+;base64,/, ''), field.id);
                    setImageSrc(base64);
                    setDirty(true);
                }}
            />
            <img
                style={{ width: '70px', height: 'auto' }}
                draggable={false}
                src={imageSrc}
                alt="None"
            />
        </Stack>
    );
};

export default React.memo(ImageSelectEdit);
