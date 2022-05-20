import React from 'react';

import { Page } from '@react-pdf/renderer';

import { DocumentData } from '../../../interface/document-data';
import { StudyData } from '../../../interface/study-data';
import PDFFooter from '../PDFFooter/PDFFooter';
import PDFHeader from '../PDFHeader/PDFHeader';
import { styles } from '../styles/style';

interface Props {
    formData: DocumentData;
    activeStudy: Partial<StudyData>;
    reportName: string;
    logoUrl: string;
    qrCodeUrl: string;
    children: React.ReactNode;
}

const PDFPage = ({ formData, activeStudy, logoUrl, qrCodeUrl, reportName, children }: Props) => {
    return (
        <Page size="A4" style={styles.page}>
            <PDFHeader
                formData={formData}
                logoUrl={logoUrl}
                qrCodeUrl={qrCodeUrl}
                activeStudy={activeStudy}
                reportName={reportName}
            />
            {children}
            <PDFFooter />
        </Page>
    );
};

export default React.memo(PDFPage);
