import React from 'react';

import { View } from '@react-pdf/renderer';

import { Section, SubSection } from '../../../interface/define';
import { DocumentData } from '../../../interface/document-data';
import { Field } from '../../../interface/field';
import { FilterCondition } from '../../../interface/selection-field';
import PDFField from '../PDFField/PDFField';
import { styles } from '../styles/style';

interface Props {
    formSections: Section[];
    formData: DocumentData;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFReportContent = ({ formSections, formData, getOptions }: Props) => {
    return (
        <>
            {formSections
                .filter((section: Section) => !section.hide)
                .map((section: Section) => {
                    return (
                        // Section
                        <View wrap={false} key={section.id} style={{ ...styles.section }}>
                            {section.subSections.map(
                                (subSection: SubSection, subSectionIdx: number) => {
                                    return (
                                        // SubSection
                                        <View
                                            key={subSection.id}
                                            style={{
                                                ...styles.subSection,
                                                width: `${section.ratio[subSectionIdx]}%`,
                                            }}
                                        >
                                            {subSection.fields.map((field: Field) => {
                                                // Field
                                                return (
                                                    <View
                                                        key={field.id}
                                                        style={{
                                                            ...styles.fieldSection,
                                                            flexDirection:
                                                                field.orientation === 'vertical'
                                                                    ? 'column'
                                                                    : 'row',
                                                        }}
                                                    >
                                                        <PDFField
                                                            field={field}
                                                            formData={formData}
                                                            value={formData[field.id]}
                                                            getOptions={getOptions}
                                                        />
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    );
                                },
                            )}
                        </View>
                    );
                })}
        </>
    );
};

export default React.memo(PDFReportContent);
