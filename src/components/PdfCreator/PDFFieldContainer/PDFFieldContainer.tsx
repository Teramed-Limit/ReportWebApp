import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { fieldSectionContainer } from '../../../styles/report/style';

interface Props {
    orientation: 'column' | 'row';
    children: React.ReactNode;
}

const PDFFieldContainer = ({ orientation, children }: Props) => {
    return (
        <ReactPDF.View
            wrap={false}
            style={{
                ...(fieldSectionContainer as Style),
                ...{ flexDirection: orientation },
            }}
        >
            {children}
        </ReactPDF.View>
    );
};

export default React.memo(PDFFieldContainer);
