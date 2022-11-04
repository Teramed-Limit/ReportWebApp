import React, { CSSProperties, useContext, useRef } from 'react';

import { Box, Stack } from '@mui/material';
import { observer } from 'mobx-react';

import Button from '../../components/UI/Button/Button';
import { noBorderField } from '../../container/Report/field/field-type';
import FormSectionFieldLabel from '../../container/Report/layout-container/FormSectionFieldLabel/FormSectionFieldLabel';
import ReportDynamicField from '../../container/Report/ReportDynamicField/ReportDynamicField';
import { NotificationContext } from '../../context/notification-context';
import { BaseActionParams } from '../../interface/action';
import { CompositeField } from '../../interface/composite-field';
import { Field } from '../../interface/field';
import { useReportDataStore } from '../../models/useStore';
import {
    fieldSectionValue,
    compositeFieldSpacing,
    fieldButtonBar,
    fieldGutter,
    fieldSectionContainer,
    fieldFlex,
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
    const { formState, formData, reportDisabled } = useReportDataStore();

    const actionDispatcher = useContext(actionContext);
    const { openNotification } = useContext(NotificationContext);
    const inputRef = useRef();

    const executeAction = (action: string, actionParams: BaseActionParams) => {
        if (!actionDispatcher[action]) {
            console.error('Action not defined');
            return;
        }

        actionDispatcher[action]({
            ...actionParams,
            ref: inputRef,
            formData: formData.toJSON(),
            compositeField,
            openNotification,
        });
    };

    const buttonBarComponent = (field: Field) =>
        field.buttonBar === undefined ? null : (
            <Stack sx={fieldButtonBar} spacing={1}>
                {field.buttonBar
                    .filter((buttonMeta) => !buttonMeta.hide)
                    .map((buttonMeta) => (
                        <Button
                            key={buttonMeta.id}
                            theme="primary"
                            disabled={buttonMeta?.disable !== 'never' && reportDisabled}
                            onClick={() =>
                                executeAction(buttonMeta.action, {
                                    ...buttonMeta.actionParams,
                                    field,
                                })
                            }
                        >
                            {buttonMeta.label}
                        </Button>
                    ))}
            </Stack>
        );

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
                            buttonBarComponent={buttonBarComponent(field)}
                            errorMessage={errorMessage}
                            disabled={reportDisabled}
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
