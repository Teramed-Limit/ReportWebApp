import React, { CSSProperties, useContext, useRef } from 'react';

import { Box, Stack } from '@mui/material';
import { observer } from 'mobx-react';

import Button from '../../../../components/UI/Button/Button';
import { NotificationContext } from '../../../../context/notification-context';
import { BaseActionParams } from '../../../../interface/action';
import { Field } from '../../../../interface/field';
import FormSectionField from '../../../../layout/FormSectionField/FormSectionField';
import { useReportDataStore } from '../../../../models/useStore';
import {
    fieldButtonBar,
    fieldGutter,
    fieldSectionContainer,
} from '../../../../styles/report/style';
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
    const actionDispatcher = useContext(actionContext);
    const { openNotification } = useContext(NotificationContext);
    const inputRef = useRef();
    const { formState, formData, modifiable } = useReportDataStore();

    const { isDirty, isValid, errorMessage } = formState.get(field.id) || {
        isDirty: false,
        isValid: false,
        errorMessage: '',
    };

    const executeAction = (action: string, actionParams: BaseActionParams) => {
        if (!actionDispatcher[action]) {
            console.error('Action not defined');
            return;
        }

        actionDispatcher[action]({
            ...actionParams,
            ref: inputRef,
            formData: formData.toJSON(),
            field,
            openNotification,
        });
    };

    const buttonBarComponent =
        field.buttonBar === undefined ? null : (
            <Stack sx={fieldButtonBar} spacing={1}>
                {field.buttonBar
                    .filter((buttonMeta) => !buttonMeta.hide)
                    .map((buttonMeta) => (
                        <Button
                            key={buttonMeta.id}
                            theme="primary"
                            disabled={buttonMeta?.disable !== 'never' && !modifiable}
                            onClick={() =>
                                executeAction(buttonMeta.action, buttonMeta.actionParams)
                            }
                        >
                            {buttonMeta.label}
                        </Button>
                    ))}
            </Stack>
        );

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
                buttonBarComponent={buttonBarComponent}
                fieldComponent={
                    <ReportDynamicField
                        ref={inputRef}
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
