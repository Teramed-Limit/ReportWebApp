import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { DocumentData } from '../../../interface/document-data';
import { CompositeField } from '../../../interface/report-field/composite-field';
import { FilterCondition, OptionSource } from '../../../interface/report-field/selection-field';
import PDFFieldContainer from '../PDFFieldContainer/PDFFieldContainer';
import PDFFieldLabel from '../PDFFieldLabel/PDFFieldLabel';
import PDFFieldRenderer from '../PDFFieldRenderer/PDFFieldRenderer';

interface Props {
    field: CompositeField;
    formData: DocumentData;
    diagramUrl: string;
    getOptions: (
        optionSource: OptionSource<any>,
        filterCondition?: FilterCondition | undefined,
    ) => any[];
}

const PDFCompositeField = ({ field, formData, diagramUrl, getOptions }: Props) => {
    return (
        <PDFFieldContainer orientation={field.orientation}>
            {/* Label */}
            <PDFFieldLabel field={field} />
            {/* Value */}
            <ReactPDF.View
                style={{
                    flex: '0 0 auto',
                    flexDirection: field.compositeOrientation,
                    width:
                        field.orientation === 'column'
                            ? '100%'
                            : `calc(100% - ${field.labelWidth || '35%'})`,
                }}
            >
                {field.fields.map((compositeChildField, idx) => {
                    const compositeChildValue = formData[compositeChildField.id];

                    return (
                        <ReactPDF.View
                            key={compositeChildField.id}
                            style={{
                                flexGrow: 0,
                                flexShrink: 0,
                                flexBasis: 'auto',
                                padding:
                                    field.orientation === 'row' &&
                                    field.compositeOrientation === 'row' &&
                                    idx > 0
                                        ? '0 3px'
                                        : '0',
                            }}
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
