import React, { useState } from 'react';

import { Tooltip } from '@mui/material';
import cx from 'classnames';
import { FaInfoCircle } from 'react-icons/fa';

import { isEmptyOrNil } from '../../utils/general';
import classes from './FormSectionField.module.scss';

interface FormSectionFieldProps {
    id: string;
    label?: string;
    hint?: string;
    orientation?: string;
    labelAlign?: string;
    hideLabelSection?: boolean;
    readOnly: boolean;
    hasValidation: boolean;
    isDirty: boolean;
    isValid: boolean;
    errorMessage: string;
    disabled: boolean;
    noBorder: boolean;
    buttonBarComponent?: JSX.Element | null;
    fieldComponent: JSX.Element | null;
}

const FormSectionField = ({
    id,
    label = '',
    hint = '',
    labelAlign = 'center',
    orientation = 'horizontal',
    hideLabelSection = false,
    readOnly = false,
    hasValidation = false,
    isDirty = false,
    isValid = true,
    errorMessage = '',
    disabled = false,
    noBorder = false,
    buttonBarComponent = null,
    fieldComponent,
}: FormSectionFieldProps) => {
    const [hover, setHover] = useState(false);

    return (
        <>
            <div
                id={`formSectionField__${id}`}
                className={cx(classes[`input-wrapper`], {
                    [classes.vertical]: orientation === 'vertical',
                })}
            >
                {hideLabelSection ? null : (
                    <span
                        style={{ alignItems: labelAlign }}
                        className={classes[`section-field-label`]}
                    >
                        {label ? (
                            <span
                                className={cx(classes, {
                                    [classes.requiredStar]: hasValidation,
                                })}
                            >
                                {label}
                                {!isEmptyOrNil(hint) ? (
                                    <Tooltip title={hint}>
                                        <div className={classes.inline}>
                                            <FaInfoCircle color="rgb(239, 171, 61)" />
                                        </div>
                                    </Tooltip>
                                ) : null}
                            </span>
                        ) : null}
                    </span>
                )}

                <Tooltip title={errorMessage} arrow open={hover && isDirty && !isValid}>
                    <div
                        onMouseOver={() => setHover(true)}
                        onMouseOut={() => setHover(false)}
                        onFocus={() => 0}
                        onBlur={() => 0}
                        className={cx(classes[`input-field-container`], {
                            [classes.readonly]: readOnly,
                            [classes.noBorder]: noBorder,
                            [classes.invalid]: isDirty && !isValid,
                            [classes.disabled]: disabled,
                        })}
                    >
                        <div className={cx(classes[`field-base`])}>{fieldComponent}</div>
                    </div>
                </Tooltip>
            </div>
            {buttonBarComponent}
        </>
    );
};

export default FormSectionField;
