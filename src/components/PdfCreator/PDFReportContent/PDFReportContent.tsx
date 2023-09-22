import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { FormFieldType } from '../../../container/Report/FieldComponent/field-type';
import { Section, SubSection } from '../../../interface/define';
import { DocumentData } from '../../../interface/document-data';
import { ArrayField } from '../../../interface/report-field/array-field';
import { CompositeField } from '../../../interface/report-field/composite-field';
import { Field } from '../../../interface/report-field/field';
import { FilterCondition, OptionSource } from '../../../interface/report-field/selection-field';
import { reportPage } from '../../../styles/report/style';
import PDFArrayField from '../PDFArrayField/PDFArrayField';
import PDFCompositeField from '../PDFCompositeField/PDFCompositeField';
import PDFField from '../PDFField/PDFField';
import PDFReportSection from '../PDFReportSection/PDFReportSection';
import PDFReportSubSection from '../PDFReportSubSection/PDFReportSubSection';

interface Props {
    pagePadding: number;
    formSections: Section[];
    formData: DocumentData;
    diagramUrl: string;
    getOptions: (source: OptionSource<any>, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFReportContent = ({
    pagePadding,
    formSections,
    formData,
    diagramUrl,
    getOptions,
}: Props) => {
    return (
        <ReactPDF.View style={{ paddingHorizontal: pagePadding }}>
            <ReactPDF.View style={reportPage as Style}>
                {formSections
                    .filter((section: Section) => !section.hide)
                    .filter((section: Section) => !section.hideInPDF)
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
