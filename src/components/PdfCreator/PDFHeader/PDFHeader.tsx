import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { isEmptyOrNil } from '../../../utils/general';
import { styles } from '../styles/style';

interface Props {
    logoUrl: string;
    reportName: string;
    children: React.ReactNode;
}

const PDFHeader = ({ logoUrl, reportName, children }: Props) => {
    return (
        <>
            <ReactPDF.View style={styles.header} fixed>
                {!isEmptyOrNil(logoUrl) && (
                    <ReactPDF.Image style={styles.hospitalLogo} src={logoUrl} />
                )}
                <ReactPDF.View style={styles.headerReportContainer}>
                    <ReactPDF.Text style={styles.headerReport}>{reportName}</ReactPDF.Text>
                </ReactPDF.View>
            </ReactPDF.View>
            <ReactPDF.View style={styles.divider} fixed />
            <ReactPDF.View fixed>{children}</ReactPDF.View>
        </>
    );
};

export default React.memo(PDFHeader);
