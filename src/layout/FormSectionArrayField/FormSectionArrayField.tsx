import React, { useCallback, useEffect, useState } from 'react';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, Button, IconButton } from '@mui/material';
import { observer } from 'mobx-react';
import * as R from 'ramda';

import { FormFieldType } from '../../container/Report/field/field-type';
import FormSectionFieldContainer from '../../container/Report/layout-container/FormSectionFieldContainer/FormSectionFieldContainer';
import { ArrayField } from '../../interface/array-field';
import { CompositeField } from '../../interface/composite-field';
import { useReportDataStore } from '../../models/useStore';
import { fieldArrayContainer, fieldGutter, valueWidth } from '../../styles/report/style';
import FormSectionCompositeField from '../FormSectionCompositeField/FormSectionCompositeField';
import classes from './FormSectionArrayField.module.scss';

interface Props {
    field: ArrayField;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const FormSectionArrayField = ({ field: arrayField, actionContext }: Props) => {
    const { formData, valueChanged, modifiable, loading } = useReportDataStore();
    const [fieldValue, setFieldValue] = useState<any[]>(formData.get(arrayField.id) || []);

    const onValueChange = (idx: number, id: string, text: string) => {
        setFieldValue((pre) => {
            valueChanged(arrayField.id, R.assocPath([idx, id], text, pre));
            return R.assocPath([idx, id], text, pre);
        });
    };

    const onValueGetter = (idx: number, id: string): string => {
        return R.path([idx, id], fieldValue) || '';
    };

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

    const addField = useCallback(() => {
        setFieldValue((pre) => {
            // 新增對應Template Id的欄位
            const addedValue = newTemplateValue();
            valueChanged(arrayField.id, R.append(addedValue, pre));
            return R.append(addedValue, pre);
        });
    }, [arrayField.id, newTemplateValue, valueChanged]);

    const deleteField = (idx: number) => {
        setFieldValue((pre) => {
            if (!pre && !pre?.[idx]) return;
            valueChanged(arrayField.id, R.remove(idx, 1, pre));
            return R.remove(idx, 1, pre);
        });
    };

    useEffect(() => {
        if (loading) return;

        setFieldValue(() => {
            let valueList = formData.get(arrayField.id) || [];
            // 預設給一個Item
            if (!valueList || valueList.length === 0) {
                const addedValue = newTemplateValue();
                valueChanged(arrayField.id, [addedValue]);
                return [addedValue];
            }

            // 已經有值
            if (!Array.isArray(valueList)) valueList = Array.from(valueList);
            return valueList;
        });
    }, [arrayField.id, arrayField.templateField, formData, loading, valueChanged]);

    return (
        <Box
            id={`fieldArrayContainer__${arrayField.id}`}
            sx={{ ...fieldArrayContainer, flexDirection: arrayField.orientation }}
        >
            {fieldValue?.map((value, idx) => {
                switch (arrayField.templateField.type) {
                    case FormFieldType.Composite:
                        return (
                            <FormSectionCompositeField
                                key={`${arrayField.templateField.id}_${idx.toString()}`}
                                field={
                                    {
                                        ...arrayField.templateField,
                                        id: `${arrayField.templateField.id} ${idx + 1}`,
                                        label: `${arrayField.templateField.label} ${idx + 1}`,
                                    } as CompositeField
                                }
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
                        debugger;
                        return (
                            <FormSectionFieldContainer
                                key={`${arrayField.templateField.id}_${idx.toString()}`}
                                field={{
                                    ...arrayField.templateField,
                                    label: `${arrayField.templateField.label} ${idx + 1}`,
                                }}
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
                    sx={{ width: valueWidth }}
                    variant="contained"
                    onClick={addField}
                >
                    Add {arrayField.templateField.label}
                </Button>
            </Box>
        </Box>
    );
};

export default observer(FormSectionArrayField);
