import React from 'react';

import { FormFieldType } from '../../container/Report/field/field-type';
import FormSectionFieldContainer from '../../container/Report/layout-container/FormSectionFieldContainer/FormSectionFieldContainer';
import { ArrayField } from '../../interface/array-field';
import { CompositeField } from '../../interface/composite-field';
import { SubSection } from '../../interface/define';
import FormSectionArrayField from '../FormSectionArrayField/FormSectionArrayField';
import FormSectionCompositeField from '../FormSectionCompositeField/FormSectionCompositeField';
import classes from './ReportSubSection.module.scss';

interface Props {
    subSection: SubSection;
    ratio: string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportSubSection = ({ subSection, ratio, actionContext }: Props) => {
    return (
        <div
            id={subSection.id}
            className={classes[`subSection-wrapper`]}
            style={{
                maxWidth: ratio,
            }}
        >
            {subSection.fields
                .filter((field) => !field.hide)
                .map((field, idx) => {
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
                                    ratio={subSection.ratio[idx]}
                                    field={field}
                                    actionContext={actionContext}
                                />
                            );
                    }
                })}
        </div>
    );
};

export default ReportSubSection;
