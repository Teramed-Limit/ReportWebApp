import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { FormEditorDef } from '../../interface/form-editor-define';
import { EditorMapper } from './Editor/editorMapper';
import { ValidationMapper } from './Editor/validationMapper';
import classes from './FormEditor.module.scss';

interface Props {
    saveType: string;
    formDef: FormEditorDef;
    formData: any;
    formDataChanged: (field, value) => void;
    formInvalidChanged?: (isValid: boolean) => void;
    header?: string;
}

const FormEditor = ({
    saveType,
    formDef,
    formData,
    formDataChanged,
    formInvalidChanged,
    header = '',
}: Props) => {
    const [sectionCount] = useState(formDef.sections.length);
    const [formValidateRecord, setFormValidateRecord] = useState({});

    const onValueChanged = useCallback(
        (value: any, fieldId: string) => {
            formDataChanged(fieldId, value);
        },
        [formDataChanged],
    );

    useEffect(() => {
        const initFormInvalid: { [props: string]: boolean } = {};
        formDef.sections.forEach((section) => {
            section.fields.forEach((field) => {
                const value = formData[field.id] || '';
                let validator;
                if (field.validate) validator = ValidationMapper[field.validate.type];
                return field.validate
                    ? (initFormInvalid[field.id] = validator(value))
                    : (initFormInvalid[field.id] = true);
            });
        });
        setFormValidateRecord(initFormInvalid);
    }, [formData, formDef]);

    useEffect(() => {
        const formIsValid = Object.entries(formValidateRecord).every(([, value]) => value);
        formInvalidChanged?.(formIsValid);
    }, [formValidateRecord, formInvalidChanged]);

    return (
        <>
            {header === '' ? null : <h2>{header}</h2>}
            <div className={classes.container}>
                {formDef.sections.map((section, index) => {
                    let autoFocusIdx = 0;
                    return (
                        <div
                            key={index.toString()}
                            style={{ flex: `${100 / sectionCount}%` }}
                            className={classes.section}
                        >
                            {section.fields.map((fieldDef, idx) => {
                                const RenderComponent = EditorMapper[fieldDef.type];
                                let readonly = fieldDef.readOnly;
                                if (saveType === 'add') readonly = false;
                                if (readonly) autoFocusIdx++;
                                const value = formData[fieldDef.id] || '';

                                return (
                                    <Box key={fieldDef.id} sx={{ m: '8px 0' }}>
                                        <RenderComponent
                                            field={fieldDef}
                                            autoFocus={autoFocusIdx === idx}
                                            value={value}
                                            isValid={formValidateRecord[fieldDef.id]}
                                            readOnly={readonly}
                                            onValueChanged={onValueChanged}
                                        />
                                    </Box>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default FormEditor;
