import React from 'react';

import { Page } from '@react-pdf/renderer';

import PDFFooter from '../PDFFooter/PDFFooter';
import PDFHeader from '../PDFHeader/PDFHeader';
import { styles } from '../styles/style';

interface Props {
    reportName: string;
    logoUrl: string;
    signatureUrl: string;
    children: React.ReactNode;
}

const PDFPage = ({ logoUrl, signatureUrl, reportName, children }: Props) => {
    return (
        <Page size="A4" style={styles.page}>
            <PDFHeader logoUrl={logoUrl} reportName={reportName} />
            {children}
            <PDFFooter signatureUrl={signatureUrl} />
        </Page>
    );
};

export default React.memo(PDFPage);
