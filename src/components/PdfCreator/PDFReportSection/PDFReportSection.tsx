import React from 'react';

import { View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { Section } from '../../../interface/define';
import { reportSection } from '../../../styles/report/style';

interface Props {
    section: Section;
    children?: React.ReactNode;
}

export const margin = 0.25;

const PDFReportSection = ({ section, children }: Props) => {
    return (
        <View
            wrap={false}
            style={{
                ...(reportSection as Style),
                maxWidth: section.maxWidth,
                width: section.maxWidth,
            }}
        >
            {children}
        </View>
    );
};

export default React.memo(PDFReportSection);
