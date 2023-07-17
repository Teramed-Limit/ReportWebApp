import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { UserAccountInfo } from '../../../interface/auth';
import { RepImageComponent } from '../../../interface/report-generator/component/rep-image-component';

interface Props {
    uuid: string;
    zoom: number;
    comp: RepImageComponent;
    userData: UserAccountInfo;
}

const PDFSignatureComponent = ({ uuid, zoom, comp, userData }: Props) => {
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
            src={userData.SignatureUrl}
        />
    );
};

export default PDFSignatureComponent;
