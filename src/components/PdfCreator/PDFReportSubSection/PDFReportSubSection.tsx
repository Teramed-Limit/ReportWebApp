import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { SubSection } from '../../../interface/define';
import { reportSubsection } from '../../../styles/report/style';

interface Props {
    subSection: SubSection;
    children?: React.ReactNode;
}

const PDFReportSubSection = ({ subSection, children }: Props) => {
    return (
        <ReactPDF.View
            style={{
                ...(reportSubsection as Style),
                maxWidth: subSection.maxWidth,
                width: subSection.maxWidth,
            }}
        >
            {children}
        </ReactPDF.View>
    );
};

export default React.memo(PDFReportSubSection);
