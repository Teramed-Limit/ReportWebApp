import React from 'react';

import { Text, View } from '@react-pdf/renderer';

import { standardDefine } from '../../../constant/pdf-define/standard-define';
import { Section, SubSection } from '../../../interface/define';
import { DocumentData } from '../../../interface/document-data';
import { Field } from '../../../interface/field';
import { styles } from '../styles/style';

interface Props {
    formData: DocumentData;
}

const PDFReportContent = ({ formData }: Props) => {
    return (
        <>
            {standardDefine.sections
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
                                                        {/* Label */}
                                                        {!field.hideLabel && (
                                                            <Text
                                                                style={{
                                                                    ...styles.label,
                                                                    ...(field.orientation ===
                                                                    'vertical'
                                                                        ? {
                                                                              ...styles.labelVertical,
                                                                          }
                                                                        : {
                                                                              ...styles.labelHorizontal,
                                                                          }),
                                                                }}
                                                            >
                                                                {field.label}:
                                                            </Text>
                                                        )}
                                                        {/* Value */}
                                                        <Text
                                                            style={{
                                                                ...styles.textValue,
                                                                ...(field.orientation === 'vertical'
                                                                    ? {
                                                                          ...styles.textValueVertical,
                                                                      }
                                                                    : {
                                                                          ...styles.textValueHorizontal,
                                                                      }),
                                                            }}
                                                        >
                                                            {formData[field.id] || ''}
                                                        </Text>
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
