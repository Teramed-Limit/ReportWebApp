import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { Field } from '../../../interface/report-field/field';
import { FilterCondition, OptionSource } from '../../../interface/report-field/selection-field';
import PDFFieldContainer from '../PDFFieldContainer/PDFFieldContainer';
import PDFFieldLabel from '../PDFFieldLabel/PDFFieldLabel';
import PDFFieldRenderer from '../PDFFieldRenderer/PDFFieldRenderer';

interface Props {
    field: Field;
    value: string;
    diagramUrl: string;
    getOptions: (source: OptionSource<any>, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFField = ({ field, value, diagramUrl, getOptions }: Props) => {
    return (
        <PDFFieldContainer orientation={field.orientation}>
            {/* Label */}
            <PDFFieldLabel field={field} />
            {/* Value */}
            <ReactPDF.View
                style={{
                    width:
                        field.orientation === 'column'
                            ? '100%'
                            : `calc(100% - ${field.labelWidth || '35%'})`,
                }}
            >
                <PDFFieldRenderer
                    field={field}
                    value={value}
                    diagramUrl={diagramUrl}
                    getOptions={getOptions}
                />
            </ReactPDF.View>
        </PDFFieldContainer>
    );
};

export default React.memo(PDFField);
