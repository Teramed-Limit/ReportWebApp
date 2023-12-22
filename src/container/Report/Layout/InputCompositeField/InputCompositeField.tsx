import React, { CSSProperties } from 'react';

import { Box, Stack } from '@mui/material';
import { observer } from 'mobx-react';

import {
    CompositeField,
    InnerCompositeField,
} from '../../../../interface/report-field/composite-field';
import { fieldSectionContainer } from '../../../../styles/report/style';
import { FieldMapper } from '../../FieldComponent/field-mapper';
import InputFieldContainer from '../InputFieldContainer/InputFieldContainer';
import InputFieldLabel from '../InputFieldLabel/InputFieldLabel';

interface Props {
    field: CompositeField;
    fieldMapper?: { [key: string]: React.ComponentType<any> };
    orientation: 'row' | 'column';
    customValueChange?: (id: string, text: string) => void;
    customValueGetter?: (id: string) => string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const InputCompositeField = ({
    field: compositeField,
    fieldMapper = FieldMapper,
    orientation,
    customValueChange,
    customValueGetter,
    actionContext,
    prefixComp,
    suffixComp,
}: Props) => {
    return (
        <Box
            id={`formSectionCompositeContainer__${compositeField.id}`}
            sx={{
                ...fieldSectionContainer,
                flexDirection: orientation,
            }}
        >
            {/* Label */}
            <InputFieldLabel
                id={compositeField.id}
                label={compositeField.label}
                labelStyle={{
                    ...(compositeField.labelStyle as CSSProperties),
                    flex: `0 0 ${compositeField?.labelWidth || '35%'}`,
                }}
                hint={compositeField.hint}
                hideLabelSection={compositeField.hideLabel}
                hasValidation={false}
                prefixComp={prefixComp}
                suffixComp={suffixComp}
            />
            {/* Value */}
            <Stack
                direction={compositeField.compositeOrientation}
                sx={{
                    flexDirection: compositeField.compositeOrientation,
                    flex: `1 1 auto`,
                    maxWidth:
                        compositeField.orientation === 'column'
                            ? '100%'
                            : `calc(100% - ${compositeField.labelWidth || '35%'})`,
                }}
            >
                {compositeField.fields.map((innerField: InnerCompositeField) => {
                    return (
                        <InputFieldContainer
                            key={`${innerField.id}`}
                            field={{ ...innerField, hideLabel: true }}
                            fieldMapper={fieldMapper}
                            orientation={compositeField.orientation}
                            actionContext={actionContext}
                            customValueChange={customValueChange}
                            customValueGetter={customValueGetter}
                        />
                    );
                })}
            </Stack>
        </Box>
    );
};

export default observer(InputCompositeField);
