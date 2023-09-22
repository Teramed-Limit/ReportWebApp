import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { UserAccountInfo } from '../../../interface/auth';
import { DocumentData } from '../../../interface/document-data';
import { RepLabelComponent } from '../../../interface/report-generator/component/rep-label-component';

interface Props {
    comp: RepLabelComponent;
    formData: DocumentData;
    userData: UserAccountInfo;
}

const PDFDynamicLabelComponent = ({ comp, formData, userData }: Props) => {
    return (
        <ReactPDF.Text
            style={{
                position: 'absolute',
                fontSize: `${comp.fontSize}`,
                fontFamily: comp.fontName,
                fontStyle: comp.fontStyle,
                fontWeight: comp.fontWeight,
                color: comp.fontColor,
                left: comp.x,
                top: comp.y,
            }}
        >
            {comp.prefix}
            {formData[comp.value] || userData[comp.value]}
            {comp.suffix}
        </ReactPDF.Text>
    );
};

export default PDFDynamicLabelComponent;
