import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { Field } from '../../../interface/field';
import { FilterCondition } from '../../../interface/selection-field';
import { fieldFlex, fieldSectionValue } from '../../../styles/report/style';
import PDFFieldContainer from '../PDFFieldContainer/PDFFieldContainer';
import PDFFieldLabel from '../PDFFieldLabel/PDFFieldLabel';
import PDFFieldRenderer from '../PDFFieldRenderer/PDFFieldRenderer';

interface Props {
    field: Field;
    value: string;
    diagramUrl: string;
    pdfStyle: {
        imagePerRow: number;
        imagePageBreak: boolean;
        fontSize: number;
        pagePadding: number;
    };
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFField = ({ field, value, diagramUrl, pdfStyle, getOptions }: Props) => {
    return (
        <PDFFieldContainer orientation={field.orientation} pdfStyle={pdfStyle}>
            {/* Label */}
            <PDFFieldLabel field={field} />
            {/* Value */}
            <ReactPDF.View
                style={{
                    ...(fieldSectionValue as Style),
                    ...(fieldFlex.value[field.orientation] as Style),
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
