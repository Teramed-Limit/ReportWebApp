import React, { CSSProperties, useContext, useRef } from 'react';

import { observer } from 'mobx-react';

import Button from '../../../../components/UI/Button/Button';
import { NotificationContext } from '../../../../context/notification-context';
import { BaseActionParams } from '../../../../interface/action';
import { Field } from '../../../../interface/field';
import FormSectionField from '../../../../layout/FormSectionField/FormSectionField';
import { useReportDataStore } from '../../../../models/useStore';
import { noBorderField } from '../../field/field-type';
import ReportDynamicField from '../../ReportDynamicField/ReportDynamicField';
import classes from './FormSectionFieldContainer.module.scss';

interface FormSectionFieldProps {
    field: Field;
    ratio: string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const FormSectionFieldContainer = ({ field, ratio, actionContext }: FormSectionFieldProps) => {
    const actionDispatcher = useContext(actionContext);
    const { openNotification } = useContext(NotificationContext);
    const inputRef = useRef();
    const { formState, formData, reportDisabled } = useReportDataStore();

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
            <div className={classes.buttonBar}>
                {field.buttonBar
                    .filter((buttonMeta) => !buttonMeta.hide)
                    .map((buttonMeta) => (
                        <Button
                            key={buttonMeta.id}
                            theme="primary"
                            disabled={buttonMeta?.disable !== 'never' && reportDisabled}
                            onClick={() =>
                                executeAction(buttonMeta.action, buttonMeta.actionParams)
                            }
                        >
                            {buttonMeta.label}
                        </Button>
                    ))}
            </div>
        );

    return (
        <FormSectionField
            id={field.id}
            label={field.label}
            labelStyle={field?.labelStyle as CSSProperties}
            ratio={ratio}
            orientation={field.orientation}
            hideLabelSection={field.hideLabel}
            readOnly={!!field.readOnly}
            hasValidation={!!field.validate}
            isDirty={isDirty}
            isValid={isValid}
            errorMessage={errorMessage}
            disabled={reportDisabled}
            noBorder={noBorderField[field.type]}
            buttonBarComponent={buttonBarComponent}
            fieldComponent={<ReportDynamicField ref={inputRef} field={field} />}
        />
    );
};

export default observer(FormSectionFieldContainer);
