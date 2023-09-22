import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { RepPageNumberComponent } from '../../../interface/report-generator/component/rep-page-num-component';

interface Props {
    comp: RepPageNumberComponent;
}

const PDFPageNumberComponent = ({ comp }: Props) => {
    return (
        <ReactPDF.Text
            style={{
                position: 'absolute',
                fontFamily: comp.fontName,
                fontStyle: comp.fontStyle,
                fontWeight: comp.fontWeight,
                color: comp.fontColor,
                fontSize: comp.fontSize,
                left: comp.x,
                top: comp.y,
            }}
            render={({ pageNumber, totalPages }) =>
                `${pageNumber}${comp.showTotalPages ? `/${totalPages}` : ''}`
            }
        />
    );
};

export default PDFPageNumberComponent;
