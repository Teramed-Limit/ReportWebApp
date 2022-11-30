import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { FormFieldType } from '../../../container/Report/field/field-type';
import { ArrayField } from '../../../interface/array-field';
import { CompositeField } from '../../../interface/composite-field';
import { Section, SubSection } from '../../../interface/define';
import { DocumentData } from '../../../interface/document-data';
import { Field } from '../../../interface/field';
import { FilterCondition } from '../../../interface/selection-field';
import { reportPage } from '../../../styles/report/style';
import PDFArrayField from '../PDFArrayField/PDFArrayField';
import PDFCompositeField from '../PDFCompositeField/PDFCompositeField';
import PDFField from '../PDFField/PDFField';
import PDFReportSection from '../PDFReportSection/PDFReportSection';
import PDFReportSubSection from '../PDFReportSubSection/PDFReportSubSection';

interface Props {
    formSections: Section[];
    formData: DocumentData;
    diagramUrl: string;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

export const margin = 0.25;

const PDFReportContent = ({ formSections, formData, diagramUrl, getOptions }: Props) => {
    return (
        <ReactPDF.View style={{ margin: `${margin}%` }}>
            <ReactPDF.View style={reportPage as Style}>
                {formSections
                    .filter((section: Section) => !section.hide)
                    .map((section: Section) => (
                        <PDFReportSection key={section.id} section={section}>
                            {section.subSections.map((subSection: SubSection) => (
                                <PDFReportSubSection key={subSection.id} subSection={subSection}>
                                    {subSection.fields.map((field: Field) => {
                                        switch (field.type) {
                                            case FormFieldType.Array:
                                                return (
                                                    <PDFArrayField
                                                        key={field.id}
                                                        field={field as ArrayField}
                                                        formData={formData}
                                                        diagramUrl={diagramUrl}
                                                        getOptions={getOptions}
                                                    />
                                                );
                                            case FormFieldType.Composite:
                                                return (
                                                    <PDFCompositeField
                                                        key={field.id}
                                                        field={field as CompositeField}
                                                        formData={formData}
                                                        diagramUrl={diagramUrl}
                                                        getOptions={getOptions}
                                                    />
                                                );
                                            default:
                                                return (
                                                    <PDFField
                                                        key={field.id}
                                                        field={field}
                                                        value={formData[field.id]}
                                                        diagramUrl={diagramUrl}
                                                        getOptions={getOptions}
                                                    />
                                                );
                                        }
                                    })}
                                </PDFReportSubSection>
                            ))}
                        </PDFReportSection>
                    ))}
            </ReactPDF.View>
        </ReactPDF.View>
    );
};

export default React.memo(PDFReportContent);
