import React, { CSSProperties, useState } from 'react';

import { Box, Tooltip } from '@mui/material';
import cx from 'classnames';

import classes from './FormSectionField.module.scss';
import { fieldFlex, fieldSectionValue } from '../../styles/report/style';

interface FormSectionFieldProps {
    id: string;
    valueStyle?: CSSProperties;
    orientation: string;
    readOnly: boolean;
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
    orientation,
    readOnly = false,
    isDirty = false,
    isValid = true,
    errorMessage = '',
    disabled = false,
    noBorder = false,
    buttonBarComponent = null,
    fieldComponent,
    valueStyle = {},
}: FormSectionFieldProps) => {
    const [hover, setHover] = useState(false);

    if (!orientation) console.error(id);

    return (
        <>
            <Tooltip title={errorMessage} arrow open={hover && isDirty && !isValid}>
                <Box
                    sx={[fieldSectionValue, fieldFlex.value[orientation]]}
                    className={cx(classes[`input-field-container`], {
                        [classes.readonly]: readOnly,
                        [classes.noBorder]: noBorder,
                        [classes.invalid]: isDirty && !isValid,
                        [classes.disabled]: disabled,
                    })}
                    style={valueStyle}
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

export default FormSectionField;
