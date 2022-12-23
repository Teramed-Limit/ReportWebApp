import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { CompositeField } from '../../../interface/composite-field';
import { DocumentData } from '../../../interface/document-data';
import { FilterCondition } from '../../../interface/selection-field';
import { fieldFlex, fieldSectionValue } from '../../../styles/report/style';
import PDFFieldContainer from '../PDFFieldContainer/PDFFieldContainer';
import PDFFieldLabel from '../PDFFieldLabel/PDFFieldLabel';
import PDFFieldRenderer from '../PDFFieldRenderer/PDFFieldRenderer';

interface Props {
    field: CompositeField;
    formData: DocumentData;
    diagramUrl: string;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFCompositeField = ({ field, formData, diagramUrl, getOptions }: Props) => {
    return (
        <PDFFieldContainer orientation={field.orientation}>
            {/* Label */}
            <PDFFieldLabel field={field} />
            {/* Value */}
            <ReactPDF.View
                style={{
                    ...(fieldFlex.value[field.orientation] as Style),
                    ...{ flexDirection: field.compositeOrientation },
                }}
            >
                {field.fields.map((compositeChildField) => {
                    const compositeChildValue = formData[compositeChildField.id];

                    return (
                        <ReactPDF.View
                            key={compositeChildField.id}
                            style={{ ...(fieldSectionValue as Style) }}
                        >
                            <PDFFieldRenderer
                                field={compositeChildField}
                                value={compositeChildValue}
                                diagramUrl={diagramUrl}
                                getOptions={getOptions}
                            />
                        </ReactPDF.View>
                    );
                })}
            </ReactPDF.View>
        </PDFFieldContainer>
    );
};

export default React.memo(PDFCompositeField);
