import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { UserAccountInfo } from '../../../interface/auth';
import { DocumentData } from '../../../interface/document-data';
import { RepLabelComponent } from '../../../interface/report-generator/component/rep-label-component';

interface Props {
    uuid: string;
    zoom: number;
    comp: RepLabelComponent;
    formData: DocumentData;
    userData: UserAccountInfo;
}

const PDFDynamicLabelComponent = ({ uuid, zoom, comp, formData, userData }: Props) => {
    return (
        <ReactPDF.Text
            key={uuid}
            style={{
                position: 'absolute',
                fontSize: `${comp.fontSize / zoom}`,
                fontFamily: comp.fontName,
                fontStyle: comp.fontStyle,
                fontWeight: comp.fontWeight,
                color: comp.fontColor,
                left: comp.x / zoom,
                top: comp.y / zoom,
            }}
        >
            {comp.prefix}
            {formData[comp.value] || userData[comp.value]}
            {comp.suffix}
        </ReactPDF.Text>
    );
};

export default PDFDynamicLabelComponent;
