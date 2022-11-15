import React from 'react';

import { View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { CompositeField } from '../../../interface/composite-field';
import { DocumentData } from '../../../interface/document-data';
import { Field } from '../../../interface/field';
import { FilterCondition } from '../../../interface/selection-field';
import { fieldFlex, fieldSectionContainer, fieldSectionValue } from '../../../styles/report/style';
import PDFFieldContainer from '../PDFFieldContainer/PDFFieldContainer';
import PDFFieldLabel from '../PDFFieldLabel/PDFFieldLabel';
import PDFFieldRenderer from '../PDFFieldRenderer/PDFFieldRenderer';

interface Props {
    field: CompositeField;
    valueFormatter?: (field: Field) => string;
    formData: DocumentData;
    diagramUrl: string;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFCompositeField = ({ field, valueFormatter, formData, diagramUrl, getOptions }: Props) => {
    return (
        <PDFFieldContainer orientation={field.orientation}>
            {/* Label */}
            <PDFFieldLabel field={field} />
            {/* Value */}
            <View
                style={{
                    ...(fieldSectionContainer as Style),
                    ...{ flexDirection: field.compositeOrientation },
                }}
            >
                {field.fields.map((compositeChildField) => {
                    const compositeChildValue = valueFormatter
                        ? valueFormatter(compositeChildField)
                        : formData[compositeChildField.id];

                    return (
                        <View
                            key={compositeChildField.id}
                            style={{
                                ...(fieldSectionValue as Style),
                                ...(fieldFlex.value[field.compositeOrientation] as Style),
                            }}
                        >
                            <PDFFieldRenderer
                                field={compositeChildField}
                                value={compositeChildValue}
                                diagramUrl={diagramUrl}
                                getOptions={getOptions}
                            />
                        </View>
                    );
                })}
            </View>
        </PDFFieldContainer>
    );
};

export default React.memo(PDFCompositeField);
