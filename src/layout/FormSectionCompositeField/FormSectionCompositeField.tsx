import React, { CSSProperties, useContext, useRef } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react';

import Button from '../../components/UI/Button/Button';
import { noBorderField } from '../../container/Report/field/field-type';
import ReportDynamicField from '../../container/Report/ReportDynamicField/ReportDynamicField';
import { NotificationContext } from '../../context/notification-context';
import { BaseActionParams } from '../../interface/action';
import { CompositeField } from '../../interface/composite-field';
import { Field } from '../../interface/field';
import { useReportDataStore } from '../../models/useStore';
import FormSectionField from '../FormSectionField/FormSectionField';
import classes from './FormSectionCompositeField.module.scss';

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
            <div className={classes.buttonBar}>
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
            </div>
        );

    return (
        <div
            id={`formSectionComposite__${compositeField.id}`}
            className={cx(classes[`input-wrapper`])}
            style={{
                flexDirection: compositeField.orientation === 'vertical' ? 'column' : 'row',
            }}
        >
            {compositeField.label ? (
                <span
                    style={compositeField.labelStyle as CSSProperties}
                    className={classes[`section-field-label`]}
                >
                    {prefixComp}
                    <span>{compositeField.label}</span>
                    {suffixComp}
                </span>
            ) : null}

            <div
                className={classes.compositeContainer}
                style={{
                    flexDirection:
                        compositeField.compositeOrientation === 'vertical' ? 'column' : 'row',
                }}
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
                            label=""
                            orientation={field.orientation}
                            labelStyle={field?.labelStyle as CSSProperties}
                            hideLabelSection
                            readOnly={!!field.readOnly}
                            hasValidation={!!field.validate}
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
            </div>
        </div>
    );
};

export default observer(FormSectionCompositeField);
