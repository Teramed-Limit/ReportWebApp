import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { RepLineComponent } from '../../../interface/report-generator/component/rep-line-component';

interface Props {
    comp: RepLineComponent;
}

const PDFLineComponent = ({ comp }: Props) => {
    return (
        <ReactPDF.Svg
            style={{
                position: 'absolute',
                left: comp.x,
                top: comp.y,
            }}
            height={comp.height}
            width={comp.width}
        >
            <ReactPDF.Line
                x1={comp.x1}
                y1={comp.y1}
                x2={comp.x2}
                y2={comp.y2}
                strokeWidth={comp.thickness}
                stroke={comp.color}
            />
        </ReactPDF.Svg>
    );
};

export default PDFLineComponent;
