import React from 'react';

import { FormFieldType } from '../../container/Report/field/field-type';
import FormSectionFieldContainer from '../../container/Report/layout-container/FormSectionFieldContainer/FormSectionFieldContainer';
import { CompositeField } from '../../interface/composite-field';
import { SubSection } from '../../interface/define';
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
                .map((field) => {
                    return field.type === FormFieldType.Composite ? (
                        <FormSectionCompositeField key={field.id} field={field as CompositeField} />
                    ) : (
                        <FormSectionFieldContainer
                            key={field.id}
                            field={field}
                            actionContext={actionContext}
                        />
                    );
                })}
        </div>
    );
};

export default ReportSubSection;
