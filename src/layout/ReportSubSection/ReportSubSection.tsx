import React from 'react';

import { Box } from '@mui/material';

import { FormFieldType } from '../../container/Report/field/field-type';
import FormSectionFieldContainer from '../../container/Report/layout-container/FormSectionFieldContainer/FormSectionFieldContainer';
import { ArrayField } from '../../interface/array-field';
import { CompositeField } from '../../interface/composite-field';
import { SubSection } from '../../interface/define';
import { reportSubsection } from '../../styles/report/style';
import FormSectionArrayField from '../FormSectionArrayField/FormSectionArrayField';
import FormSectionCompositeField from '../FormSectionCompositeField/FormSectionCompositeField';

interface Props {
    subSection: SubSection;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportSubSection = ({ subSection, actionContext }: Props) => {
    return (
        <Box id={subSection.id} sx={reportSubsection} style={{ maxWidth: subSection?.maxWidth }}>
            {subSection.fields
                .filter((field) => !field.hide)
                .map((field) => {
                    switch (field.type) {
                        case FormFieldType.Composite:
                            return (
                                <FormSectionCompositeField
                                    key={field.id}
                                    field={field as CompositeField}
                                    actionContext={actionContext}
                                />
                            );
                        case FormFieldType.Array:
                            return (
                                <FormSectionArrayField
                                    key={field.id}
                                    field={field as ArrayField}
                                    actionContext={actionContext}
                                />
                            );
                        default:
                            return (
                                <FormSectionFieldContainer
                                    key={field.id}
                                    field={field}
                                    actionContext={actionContext}
                                />
                            );
                    }
                })}
        </Box>
    );
};

export default ReportSubSection;
