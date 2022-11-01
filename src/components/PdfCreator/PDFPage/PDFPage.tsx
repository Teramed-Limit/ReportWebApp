import React from 'react';

import { Page } from '@react-pdf/renderer';

import { UserSignature } from '../../../interface/user-signature';
import PDFFooter from '../PDFFooter/PDFFooter';
import PDFHeader from '../PDFHeader/PDFHeader';
import { styles } from '../styles/style';

interface Props {
    reportName: string;
    logoUrl: string;
    signatureData: UserSignature;
    children: React.ReactNode;
}

const PDFPage = ({ logoUrl, signatureData, reportName, children }: Props) => {
    return (
        <Page size="A4" style={styles.page}>
            <PDFHeader logoUrl={logoUrl} reportName={reportName} />
            {children}
            <PDFFooter signatureData={signatureData} />
        </Page>
    );
};

export default React.memo(PDFPage);
