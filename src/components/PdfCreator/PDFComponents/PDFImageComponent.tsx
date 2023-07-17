import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { RepImageComponent } from '../../../interface/report-generator/component/rep-image-component';

interface Props {
    uuid: string;
    zoom: number;
    comp: RepImageComponent;
}

const PDFImageComponent = ({ uuid, zoom, comp }: Props) => {
    return (
        <ReactPDF.Image
            key={uuid}
            style={{
                position: 'absolute',
                objectFit: 'contain',
                width: comp.width,
                height: comp.height,
                left: comp.x / zoom,
                top: comp.y / zoom,
            }}
            src={comp.value}
        />
    );
};

export default PDFImageComponent;
