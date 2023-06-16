import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { fieldGutter, fieldSectionContainer } from '../../../styles/report/style';

interface Props {
    orientation: 'column' | 'row';
    pdfStyle: {
        imagePerRow: number;
        imagePageBreak: boolean;
        fontSize: number;
        pagePadding: number;
    };
    children: React.ReactNode;
}

const PDFFieldContainer = ({ orientation, pdfStyle, children }: Props) => {
    return (
        <ReactPDF.View
            wrap={false}
            style={{
                ...(fieldSectionContainer as Style),
                ...{ flexDirection: orientation },
                ...{ paddingLeft: fieldGutter },
                ...{ fontSize: pdfStyle.fontSize },
            }}
        >
            {children}
        </ReactPDF.View>
    );
};

export default React.memo(PDFFieldContainer);
