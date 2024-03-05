import React, { CSSProperties, useState } from 'react';

import { Box, Tooltip } from '@mui/material';
import cx from 'classnames';

import classes from './InputField.module.scss';

interface Props {
    id: string;
    valueStyle?: CSSProperties;
    readOnly: boolean;
    isDirty: boolean;
    isValid: boolean;
    errorMessage: string;
    disabled: boolean;
    noBorder: boolean;
    buttonBarComponent?: JSX.Element | null;
    fieldComponent: JSX.Element | null;
}

const InputField = ({
    id,
    readOnly = false,
    isDirty = false,
    isValid = true,
    errorMessage = '',
    disabled = false,
    noBorder = false,
    buttonBarComponent = null,
    fieldComponent,
    valueStyle = {},
}: Props) => {
    const [hover, setHover] = useState(false);

    return (
        <>
            <Tooltip title={errorMessage} arrow open={hover && isDirty && !isValid}>
                <Box
                    className={cx(classes[`input-field-container`], {
                        [classes.readonly]: readOnly,
                        [classes.noBorder]: noBorder,
                        [classes.invalid]: isDirty && !isValid,
                        [classes.disabled]: disabled,
                    })}
                    style={{
                        ...valueStyle,
                        ...{
                            fontSize: valueStyle.fontSize
                                ? `${valueStyle.fontSize as number}pt`
                                : '10pt',
                        },
                    }}
                    onMouseOver={() => setHover(true)}
                    onMouseOut={() => setHover(false)}
                    onFocus={() => 0}
                    onBlur={() => 0}
                >
                    <div id={`formSectionField__${id}`} className={cx(classes[`field-base`])}>
                        {fieldComponent}
                    </div>
                </Box>
            </Tooltip>
            {buttonBarComponent}
        </>
    );
};

export default InputField;