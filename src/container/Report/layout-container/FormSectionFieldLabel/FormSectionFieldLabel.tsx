import React, { CSSProperties } from 'react';

import { Box, Tooltip } from '@mui/material';
import cx from 'classnames';
import { FaInfoCircle } from 'react-icons/fa';

import classes from '../../../../layout/FormSectionField/FormSectionField.module.scss';
import { fieldFlex, fieldSectionLabel } from '../../../../styles/report/style';
import { isEmptyOrNil } from '../../../../utils/general';

interface Props {
    id: string;
    label?: string;
    labelStyle?: CSSProperties;
    orientation: 'column' | 'row';
    hint?: string;
    hideLabelSection?: boolean;
    hasValidation: boolean;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}
const FormSectionFieldLabel = ({
    id,
    label = '',
    labelStyle = {},
    orientation,
    hint = '',
    hideLabelSection = false,
    hasValidation = false,
    prefixComp,
    suffixComp,
}: Props) => {
    return (
        <>
            {hideLabelSection ? null : (
                <Box
                    id={`formSectionLabel__${id}`}
                    sx={{
                        ...fieldSectionLabel,
                        // padding 4 + border 1 * 2 = 6
                        ...{ padding: '6px 0' },
                        ...fieldFlex.label[orientation],
                    }}
                    style={labelStyle}
                >
                    {label ? (
                        <Box
                            component="span"
                            style={{ display: 'flex', alignItems: 'center' }}
                            className={cx(classes, {
                                [classes.requiredStar]: hasValidation,
                            })}
                        >
                            {prefixComp}
                            {label}
                            {suffixComp}

                            {!isEmptyOrNil(hint) ? (
                                <Tooltip title={hint}>
                                    <div className={classes.inline}>
                                        <FaInfoCircle color="rgb(239, 171, 61)" />
                                    </div>
                                </Tooltip>
                            ) : null}
                        </Box>
                    ) : null}
                </Box>
            )}
        </>
    );
};

export default FormSectionFieldLabel;
