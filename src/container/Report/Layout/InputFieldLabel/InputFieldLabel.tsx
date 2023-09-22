import React, { CSSProperties } from 'react';

import { Box, Tooltip } from '@mui/material';
import cx from 'classnames';
import { FaInfoCircle } from 'react-icons/fa';

import classes from './InputFieldLabel.module.scss';
import { isEmptyOrNil } from '../../../../utils/general';

interface Props {
    id: string;
    label?: string;
    labelStyle?: CSSProperties;
    hint?: string;
    hideLabelSection?: boolean;
    hasValidation: boolean;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const InputFieldLabel = ({
    id,
    label = '',
    labelStyle = {},
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
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px',
                        ...labelStyle,
                        ...{
                            fontSize: labelStyle.fontSize
                                ? `${labelStyle.fontSize as number}pt`
                                : '10pt',
                        },
                    }}
                >
                    {label ? (
                        <Box
                            component="span"
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

export default InputFieldLabel;
