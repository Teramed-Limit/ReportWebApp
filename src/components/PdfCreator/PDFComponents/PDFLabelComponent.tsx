import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { RepLabelComponent } from '../../../interface/report-generator/component/rep-label-component';

interface Props {
    uuid: string;
    zoom: number;
    comp: RepLabelComponent;
}

const PDFLabelComponent = ({ uuid, zoom, comp }: Props) => {
    return (
        <ReactPDF.Text
            key={uuid}
            debug
            style={{
                position: 'absolute',
                fontFamily: comp.fontName,
                fontStyle: comp.fontStyle,
                fontWeight: comp.fontWeight,
                color: comp.fontColor,
                fontSize: comp.fontSize / zoom,
                left: comp.x / zoom,
                top: comp.y / zoom,
            }}
        >
            {comp.prefix}
            {comp.value}
            {comp.suffix}
        </ReactPDF.Text>
    );
};

export default PDFLabelComponent;
