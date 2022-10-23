import React, { CSSProperties } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react';

import { noBorderField } from '../../container/Report/field/field-type';
import ReportDynamicField from '../../container/Report/ReportDynamicField/ReportDynamicField';
import { CompositeField } from '../../interface/composite-field';
import { Field } from '../../interface/field';
import { useReportDataStore } from '../../models/useStore';
import FormSectionField from '../FormSectionField/FormSectionField';
import classes from './FormSectionCompositeField.module.scss';

interface FormSectionFieldProps {
    field: CompositeField;
}

const FormSectionCompositeField = ({ field: compositeField }: FormSectionFieldProps) => {
    const { formState, reportDisabled } = useReportDataStore();

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
                    <span>{compositeField.label}</span>
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
                            key={field.id}
                            id={field.id}
                            label=""
                            labelStyle={field?.labelStyle as CSSProperties}
                            hideLabelSection
                            readOnly={!!field.readOnly}
                            hasValidation={!!field.validate}
                            isDirty={isDirty}
                            isValid={isValid}
                            errorMessage={errorMessage}
                            disabled={reportDisabled}
                            noBorder={noBorderField[field.type]}
                            fieldComponent={<ReportDynamicField field={field} />}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default observer(FormSectionCompositeField);
