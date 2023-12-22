import React, { CSSProperties } from 'react';

import { Box } from '@mui/material';
import { observer } from 'mobx-react';

import { Field } from '../../../../interface/report-field/field';
import { ValidateType } from '../../../../interface/validate';
import { useReportDataStore } from '../../../../models/useStore';
import { fieldGutter, fieldSectionContainer } from '../../../../styles/report/style';
import ButtonBar from '../../ButtonBar/ButtonBar';
import { FieldMapper } from '../../FieldComponent/field-mapper';
import { noBorderField, noLabelField } from '../../FieldComponent/field-type';
import ReportDynamicField from '../../ReportDynamicField/ReportDynamicField';
import InputField from '../InputField/InputField';
import InputFieldLabel from '../InputFieldLabel/InputFieldLabel';

interface Props {
    field: Field;
    fieldMapper?: { [key: string]: React.ComponentType<any> };
    orientation: 'row' | 'column';
    customValue?: any;
    customValueChange?: (id: string, text: string) => void;
    customValueGetter?: (id: string) => string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const InputFieldContainer = ({
    field,
    fieldMapper = FieldMapper,
    customValue,
    orientation,
    customValueChange,
    customValueGetter,
    actionContext,
    prefixComp,
    suffixComp,
}: Props) => {
    const { formState, formData, modifiable, valueChanged } = useReportDataStore();
    const { isDirty, isValid, errorMessage } = formState.get(field.id) || {
        isDirty: false,
        isValid: false,
        errorMessage: '',
    };

    let value: any;
    if (customValue) {
        value = customValue;
    } else if (customValueGetter) {
        value = customValueGetter(field.id);
    } else {
        value = formData.get(field.id);
    }

    const onValueChange = (text: any) => {
        if (customValueChange) {
            customValueChange(field.id, text);
            return;
        }
        valueChanged(field.id, text);
    };

    return (
        <Box
            id={`FieldContainer__${field.id}`}
            sx={{
                ...fieldSectionContainer,
                flexDirection: orientation,
                padding: fieldGutter,
            }}
        >
            {/* Label */}
            <InputFieldLabel
                id={field.id}
                label={field.label}
                labelStyle={{
                    ...(field.labelStyle as CSSProperties),
                    flex: `0 0 ${field.labelWidth || '35%'}`,
                    maxWidth: field.labelWidth || '35%',
                }}
                hint={field.hint}
                hideLabelSection={field.hideLabel || noLabelField[field.type]}
                hasValidation={
                    field.validate !== undefined && field.validate?.type !== ValidateType.None
                }
                prefixComp={prefixComp}
                suffixComp={suffixComp}
            />
            {/* Value */}
            <InputField
                id={field.id}
                readOnly={!!field.readOnly}
                isDirty={isDirty}
                isValid={isValid}
                errorMessage={errorMessage}
                disabled={!modifiable}
                noBorder={noBorderField[field.type]}
                valueStyle={{
                    ...(field.valueStyle as CSSProperties),
                    flex: `1 1 auto`,
                    maxWidth: '100%',
                }}
                buttonBarComponent={
                    <ButtonBar
                        field={field}
                        formData={formData}
                        modifiable={modifiable}
                        actionContext={actionContext}
                    />
                }
                fieldComponent={
                    <ReportDynamicField
                        field={field}
                        fieldMapper={fieldMapper}
                        value={value}
                        modifiable={modifiable}
                        onValueChange={onValueChange}
                    />
                }
            />
        </Box>
    );
};

export default observer(InputFieldContainer);
