import React, { useCallback, useEffect } from 'react';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, Button, IconButton } from '@mui/material';
import { observer } from 'mobx-react';
import * as R from 'ramda';

import classes from './InputArrayField.module.scss';
import { ArrayField } from '../../../../interface/report-field/array-field';
import { CompositeField } from '../../../../interface/report-field/composite-field';
import { useReportDataStore } from '../../../../models/useStore';
import { fieldArrayContainer, fieldGutter } from '../../../../styles/report/style';
import { FormFieldType } from '../../FieldComponent/field-type';
import FormSectionCompositeField from '../InputCompositeField/InputCompositeField';
import FormSectionFieldContainer from '../InputFieldContainer/InputFieldContainer';

interface Props {
    field: ArrayField;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

export const GenerateArrayFieldId = (fieldId: string, idx: number) => `${fieldId}_${idx}`;

const InputArrayField = ({ field: arrayField, actionContext }: Props) => {
    const { formData, valueChanged, arrayValueChanged, modifiable, loading } = useReportDataStore();
    const fieldValue = formData.get(arrayField.id) || [];

    const onValueChange = (idx: number, targetId: string, value: string) => {
        arrayValueChanged(
            idx,
            arrayField.id,
            targetId,
            R.assocPath([idx, targetId], value, fieldValue),
            value,
        );
    };

    const onValueGetter = (idx: number, id: string): string => {
        return R.path([idx, id], fieldValue) || '';
    };

    // 新增一欄的初始值
    const newTemplateValue = useCallback(() => {
        const addedValue = {};
        if (arrayField.templateField.type === FormFieldType.Composite) {
            (arrayField.templateField as CompositeField).fields.forEach((field) => {
                addedValue[field.id] = '';
            });
        } else {
            addedValue[arrayField.templateField.id] = '';
        }

        return addedValue;
    }, [arrayField.templateField]);

    // 新增一欄
    const addField = useCallback(() => {
        valueChanged(arrayField.id, R.append(newTemplateValue(), fieldValue));
    }, [arrayField.id, fieldValue, newTemplateValue, valueChanged]);

    // 刪除一欄
    const deleteField = useCallback(
        (idx: number) => {
            valueChanged(arrayField.id, R.remove(idx, 1, fieldValue));
        },
        [arrayField.id, fieldValue, valueChanged],
    );

    // 初始化，若沒有值，預設給一欄
    useEffect(() => {
        if (loading) return;

        if (!fieldValue || fieldValue.length === 0) {
            const addedValue = newTemplateValue();
            valueChanged(arrayField.id, [addedValue]);
        }
    }, [arrayField.id, fieldValue, loading, newTemplateValue, valueChanged]);

    return (
        <Box
            id={`fieldArrayContainer__${arrayField.id}`}
            sx={{ ...fieldArrayContainer, flexDirection: arrayField.arrayOrientation || 'column' }}
        >
            {fieldValue?.map((_: any, idx: number) => {
                switch (arrayField.templateField.type) {
                    case FormFieldType.Composite:
                        return (
                            <FormSectionCompositeField
                                key={`${arrayField.templateField.id}_${idx.toString()}`}
                                field={
                                    {
                                        ...arrayField.templateField,
                                        id: GenerateArrayFieldId(arrayField.templateField.id, idx),
                                        label: `${arrayField.templateField.label} ${idx + 1}`,
                                    } as CompositeField
                                }
                                orientation={arrayField.orientation}
                                actionContext={actionContext}
                                customValueChange={(id, text) => onValueChange(idx, id, text)}
                                customValueGetter={(id) => onValueGetter(idx, id)}
                                suffixComp={
                                    <span className={classes.iconSpan}>
                                        <IconButton
                                            className={classes.icon}
                                            size="small"
                                            color="error"
                                            onClick={() => deleteField(idx)}
                                        >
                                            <RemoveCircleIcon sx={{ fontSize: '14px' }} />
                                        </IconButton>
                                    </span>
                                }
                            />
                        );
                    default:
                        return (
                            <FormSectionFieldContainer
                                key={`${arrayField.templateField.id}_${idx.toString()}`}
                                field={{
                                    ...arrayField.templateField,
                                    id: GenerateArrayFieldId(arrayField.templateField.id, idx),
                                    label: `${arrayField.templateField.label} ${idx + 1}`,
                                }}
                                orientation={arrayField.orientation}
                                actionContext={actionContext}
                                customValueChange={(id, text) => onValueChange(idx, id, text)}
                                customValueGetter={(id) => onValueGetter(idx, id)}
                                suffixComp={
                                    <span className={classes.iconSpan}>
                                        <IconButton
                                            className={classes.icon}
                                            size="small"
                                            color="error"
                                            onClick={() => deleteField(idx)}
                                        >
                                            <RemoveCircleIcon sx={{ fontSize: '16px' }} />
                                        </IconButton>
                                    </span>
                                }
                            />
                        );
                }
            })}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: fieldGutter }}>
                <Button
                    disabled={!modifiable}
                    sx={{
                        width:
                            arrayField.orientation === 'column'
                                ? '100%'
                                : `calc(100% - ${arrayField.labelWidth || '35%'})`,
                    }}
                    variant="contained"
                    onClick={addField}
                >
                    Add {arrayField.templateField.label}
                </Button>
            </Box>
        </Box>
    );
};

export default observer(InputArrayField);
