import React from 'react';

import { Box } from '@mui/material';

import { SubSection } from '../../../../interface/define';
import { ArrayField } from '../../../../interface/report-field/array-field';
import { CompositeField } from '../../../../interface/report-field/composite-field';
import { reportSubsection } from '../../../../styles/report/style';
import { FormFieldType } from '../../FieldComponent/field-type';
import InputArrayField from '../InputArrayField/InputArrayField';
import InputCompositeField from '../InputCompositeField/InputCompositeField';
import InputFieldContainer from '../InputFieldContainer/InputFieldContainer';

interface Props {
    subSection: SubSection;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportSubSection = ({ subSection, actionContext }: Props) => {
    return (
        <Box
            id={subSection.id}
            sx={{ ...reportSubsection, ...(subSection?.style || {}) }}
            style={{ maxWidth: subSection?.maxWidth, width: subSection?.maxWidth }}
        >
            {subSection.fields.map((field) => {
                switch (field.type) {
                    case FormFieldType.Composite:
                        return (
                            <InputCompositeField
                                key={field.id}
                                orientation={field.orientation}
                                field={field as CompositeField}
                                actionContext={actionContext}
                            />
                        );
                    case FormFieldType.Array:
                        return (
                            <InputArrayField
                                key={field.id}
                                field={field as ArrayField}
                                actionContext={actionContext}
                            />
                        );
                    default:
                        return (
                            <InputFieldContainer
                                key={field.id}
                                field={field}
                                orientation={field.orientation}
                                actionContext={actionContext}
                            />
                        );
                }
            })}
        </Box>
    );
};

export default ReportSubSection;
