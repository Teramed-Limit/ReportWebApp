import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { Section } from '../../../interface/define';
import { reportSection } from '../../../styles/report/style';

interface Props {
    section: Section;
    children?: React.ReactNode;
}

const PDFReportSection = ({ section, children }: Props) => {
    return (
        <>
            {section.label && (
                <ReactPDF.View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: '1pt',
                        marginTop: '4pt',
                        alignItems: 'center',
                    }}
                >
                    <ReactPDF.View
                        style={{
                            width: '4pt',
                            height: '12pt',
                            marginRight: '2pt',
                            backgroundColor: 'rgb(113, 210, 222)',
                        }}
                    ></ReactPDF.View>
                    <ReactPDF.Text style={{ fontSize: '12pt' }}>{section.label}</ReactPDF.Text>
                </ReactPDF.View>
            )}
            <ReactPDF.View
                wrap={false}
                style={{
                    ...(reportSection as Style),
                    maxWidth: section.maxWidth,
                    width: section.maxWidth,
                }}
            >
                {children}
            </ReactPDF.View>
        </>
    );
};

export default React.memo(PDFReportSection);
