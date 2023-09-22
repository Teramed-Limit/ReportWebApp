import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { RepImageComponent } from '../../../interface/report-generator/component/rep-image-component';

interface Props {
    comp: RepImageComponent;
}

const PDFImageComponent = ({ comp }: Props) => {
    return (
        <ReactPDF.Image
            style={{
                position: 'absolute',
                objectFit: 'contain',
                width: comp.width,
                height: comp.height,
                left: comp.x,
                top: comp.y,
            }}
            src={comp.src}
        />
    );
};

export default PDFImageComponent;
