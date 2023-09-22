import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { UserAccountInfo } from '../../../interface/auth';
import { RepImageComponent } from '../../../interface/report-generator/component/rep-image-component';

interface Props {
    comp: RepImageComponent;
    userData: UserAccountInfo;
}

const PDFSignatureComponent = ({ comp, userData }: Props) => {
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
            src={userData.SignatureUrl}
        />
    );
};

export default PDFSignatureComponent;
