import React, { CSSProperties } from 'react';

import { Box } from '@mui/material';
import { observer } from 'mobx-react';

import { Field } from '../../../../interface/field';
import FormSectionField from '../../../../layout/FormSectionField/FormSectionField';
import { useReportDataStore } from '../../../../models/useStore';
import { fieldGutter, fieldSectionContainer } from '../../../../styles/report/style';
import ButtonBar from '../../button-bar/ButtonBar/ButtonBar';
import { noBorderField } from '../../field/field-type';
import ReportDynamicField from '../../ReportDynamicField/ReportDynamicField';
import FormSectionFieldLabel from '../FormSectionFieldLabel/FormSectionFieldLabel';

interface FormSectionFieldProps {
    field: Field;
    customValueChange?: (id: string, text: string) => void;
    customValueGetter?: (id: string) => string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const FormSectionFieldContainer = ({
    field,
    customValueChange,
    customValueGetter,
    actionContext,
    prefixComp,
    suffixComp,
}: FormSectionFieldProps) => {
    const { formState, formData, modifiable } = useReportDataStore();
    const { isDirty, isValid, errorMessage } = formState.get(field.id) || {
        isDirty: false,
        isValid: false,
        errorMessage: '',
    };

    return (
        <Box
            id={`formSectionFieldContainer__${field.id}`}
            sx={{
                ...fieldSectionContainer,
                flexDirection: field.orientation,
                padding: fieldGutter,
            }}
        >
            {/* Label */}
            <FormSectionFieldLabel
                id={field.id}
                label={field.label}
                labelStyle={field.labelStyle as CSSProperties}
                orientation={field.orientation}
                hint={field.hint}
                hideLabelSection={field.hideLabel}
                hasValidation={!!field.validate}
                prefixComp={prefixComp}
                suffixComp={suffixComp}
            />
            {/* Value */}
            <FormSectionField
                id={field.id}
                orientation={field.orientation}
                readOnly={!!field.readOnly}
                isDirty={isDirty}
                isValid={isValid}
                errorMessage={errorMessage}
                disabled={!modifiable}
                noBorder={noBorderField[field.type]}
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
                        customValueChange={customValueChange}
                        customValueGetter={customValueGetter}
                    />
                }
            />
        </Box>
    );
};

export default observer(FormSectionFieldContainer);
