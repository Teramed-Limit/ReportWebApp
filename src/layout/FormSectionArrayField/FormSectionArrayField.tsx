import React, { useEffect, useState } from 'react';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { observer } from 'mobx-react';
import * as R from 'ramda';

import { FormFieldType } from '../../container/Report/field/field-type';
import FormSectionFieldContainer from '../../container/Report/layout-container/FormSectionFieldContainer/FormSectionFieldContainer';
import { ArrayField } from '../../interface/array-field';
import { CompositeField } from '../../interface/composite-field';
import { Field } from '../../interface/field';
import { useReportDataStore } from '../../models/useStore';
import { isEmptyOrNil } from '../../utils/general';
import FormSectionCompositeField from '../FormSectionCompositeField/FormSectionCompositeField';
import classes from './FormSectionArrayField.module.scss';

interface Props {
    field: ArrayField;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const FormSectionArrayField = ({ field: arrayField, actionContext }: Props) => {
    const { formData, valueChanged } = useReportDataStore();

    const [fields, setFields] = useState<Field[]>([]);

    const onValueChange = (idx: number, id: string, text: string) => {
        const valueList = isEmptyOrNil(formData.get(id))
            ? []
            : (formData.get(id).split('@') as string[]);

        if (valueList[idx] === undefined) valueList.push(text);
        else valueList[idx] = text;

        valueChanged(id, valueList.join('@'));
    };

    const onValueGetter = (idx: number, id: string): string => {
        const valueList = formData.get(id).split('@');
        return valueList[idx] || '';
    };

    const addField = () => {
        setFields((prev) => R.append(arrayField.templateField, prev));
    };

    const deleteField = (idx: number) => {
        setFields((prev) => R.remove(idx, 1, prev));

        if (arrayField.templateField.type === FormFieldType.Composite) {
            (arrayField.templateField as CompositeField).fields.forEach((field) => {
                const valueList = formData.get(field.id).split('@');
                const newValueList = R.remove(idx, 1, valueList);
                valueChanged(field.id, newValueList.join('@'));
            });
        } else {
            const valueList = formData.get(arrayField.templateField.id).split('@');
            const newValueList = R.remove(idx, 1, valueList);
            valueChanged(arrayField.templateField.id, newValueList.join('@'));
        }
    };

    // 初始化，自動渲染Array欄位
    useEffect(() => {
        let maxCountOfArray = 0;
        if (arrayField.templateField.type === FormFieldType.Composite) {
            (arrayField.templateField as CompositeField).fields.forEach((field) => {
                const count = (formData.get(field.id).split('@') as string[]).length;
                if (maxCountOfArray < count) maxCountOfArray = count;
            });
        } else {
            maxCountOfArray = (formData.get(arrayField.templateField.id).split('@') as string[])
                .length;
        }

        const renderFields: Field[] = [];
        for (let i = 0; i < maxCountOfArray; i++) renderFields.push(arrayField.templateField);
        setFields(renderFields);
    }, [arrayField, formData]);

    return (
        <Stack>
            {fields
                .filter((field) => !field.hide)
                .map((field, idx) => {
                    switch (field.type) {
                        case FormFieldType.Composite:
                            return (
                                <FormSectionCompositeField
                                    key={`${field.id}_${idx.toString()}`}
                                    field={
                                        {
                                            ...field,
                                            id: `${field.id} ${idx + 1}`,
                                            label: `${field.label} ${idx + 1}`,
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
                                                <RemoveCircleIcon sx={{ fontSize: '17px' }} />
                                            </IconButton>
                                        </span>
                                    }
                                />
                            );
                        default:
                            return (
                                <FormSectionFieldContainer
                                    key={`${field.id}_${idx.toString()}`}
                                    ratio="100%"
                                    field={{ ...field, label: `${field.label} ${idx + 1}` }}
                                    actionContext={actionContext}
                                    customValueChange={(id, text) => onValueChange(idx, id, text)}
                                    customValueGetter={(id) => onValueGetter(idx, id)}
                                />
                            );
                    }
                })}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Button sx={{ width: '69%' }} variant="contained" onClick={addField}>
                    Add
                </Button>
            </Box>
        </Stack>
    );
};

export default observer(FormSectionArrayField);
