import React, { CSSProperties } from 'react';

import { Box, Stack } from '@mui/material';
import { observer } from 'mobx-react';

import ButtonBar from '../../container/Report/button-bar/ButtonBar/ButtonBar';
import { noBorderField } from '../../container/Report/field/field-type';
import FormSectionFieldLabel from '../../container/Report/layout-container/FormSectionFieldLabel/FormSectionFieldLabel';
import ReportDynamicField from '../../container/Report/ReportDynamicField/ReportDynamicField';
import { CompositeField } from '../../interface/composite-field';
import { Field } from '../../interface/field';
import { useReportDataStore } from '../../models/useStore';
import {
    compositeFieldSpacing,
    fieldFlex,
    fieldGutter,
    fieldSectionContainer,
    fieldSectionValue,
} from '../../styles/report/style';
import FormSectionField from '../FormSectionField/FormSectionField';

interface FormSectionFieldProps {
    field: CompositeField;
    customValueChange?: (id: string, text: string) => void;
    customValueGetter?: (id: string) => string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const FormSectionCompositeField = ({
    field: compositeField,
    customValueChange,
    customValueGetter,
    actionContext,
    prefixComp,
    suffixComp,
}: FormSectionFieldProps) => {
    const { formState, formData, modifiable } = useReportDataStore();

    return (
        <Box
            id={`formSectionCompositeContainer__${compositeField.id}`}
            sx={{
                ...fieldSectionContainer,
                flexDirection: compositeField.orientation,
                padding: fieldGutter,
            }}
        >
            {/* Label */}
            <FormSectionFieldLabel
                id={compositeField.id}
                label={compositeField.label}
                labelStyle={compositeField.labelStyle as CSSProperties}
                orientation={compositeField.orientation}
                hint={compositeField.hint}
                hideLabelSection={compositeField.hideLabel}
                hasValidation={!!compositeField.validate}
                prefixComp={prefixComp}
                suffixComp={suffixComp}
            />
            {/* Value */}
            <Stack
                spacing={compositeFieldSpacing}
                sx={[fieldSectionValue, fieldFlex.value[compositeField.orientation]]}
                direction={compositeField.compositeOrientation}
                style={{ flexDirection: compositeField.compositeOrientation }}
            >
                {compositeField.fields.map((field: Field) => {
                    const { isDirty, isValid, errorMessage } = formState.get(field.id) || {
                        isDirty: false,
                        isValid: false,
                        errorMessage: '',
                    };
                    return (
                        <FormSectionField
                            key={`${field.id}`}
                            id={field.id}
                            orientation={field.orientation}
                            readOnly={!!field.readOnly}
                            isDirty={isDirty}
                            isValid={isValid}
                            buttonBarComponent={
                                <ButtonBar
                                    field={field}
                                    formData={formData}
                                    modifiable={modifiable}
                                    actionContext={actionContext}
                                />
                            }
                            errorMessage={errorMessage}
                            disabled={!modifiable}
                            noBorder={noBorderField[field.type]}
                            fieldComponent={
                                <ReportDynamicField
                                    field={field}
                                    customValueChange={customValueChange}
                                    customValueGetter={customValueGetter}
                                />
                            }
                        />
                    );
                })}
            </Stack>
        </Box>
    );
};

export default observer(FormSectionCompositeField);
