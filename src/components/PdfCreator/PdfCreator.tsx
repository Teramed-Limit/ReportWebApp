import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import BwipJs from 'bwip-js';
import { observer } from 'mobx-react';

import { axiosIns } from '../../axios/axios';
import { ReportTemplateList } from '../../interface/report-setting';
import { useOptionStore, useReportDataStore } from '../../models/useStore';
import Block from '../Block/Block';
import Spinner from '../Spinner/Spinner';
import PDFFooter from './PDFFooter/PDFFooter';
import PDFHeader from './PDFHeader/PDFHeader';
import PDFPhoto from './PDFPhoto/PDFPhoto';
import PDFReportContent from './PDFReportContent/PDFReportContent';
import { styles } from './styles/style';

interface Props {
    showToolbar: boolean;
}

const PdfCreator = ({ showToolbar }: Props) => {
    const { formData, activeStudy, diagramData } = useReportDataStore();
    const { getOptions } = useOptionStore();
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [qrCodeUrl, setQRCodeUrl] = useState<string>('');
    const [reportName] = useState<string>(
        (getOptions('ReportTemplateList').find(
            (x) => x.Name === formData.get('ReportTemplate'),
        ) as ReportTemplateList)?.ReportName || '內視鏡報告',
    );

    useEffect(() => {
        const subscription = axiosIns
            .get<string>('api/logo')
            .subscribe((res) => setLogoUrl(res.data));

        const qrCode = BwipJs.toCanvas('qrcode', {
            bcid: 'qrcode', // Barcode type
            text: activeStudy?.PatientId || '', // Text to encode
            scale: 1, // 3x scaling factor
            height: 75, // Bar height, in millimeters
            width: 75, // Bar height, in millimeters
            includetext: false, // Show human-readable text
            textxalign: 'center', // Always good to set this
        }).toDataURL('image/png');
        setQRCodeUrl(qrCode);

        return () => subscription.unsubscribe();
    }, [activeStudy.PatientId]);

    const onPdfRender = () => {
        setLoading(false);
    };

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <canvas style={{ display: 'none' }} id="qrcode" />
            {loading && (
                <Block>
                    <Spinner />
                </Block>
            )}
            <PDFViewer width="100%" height="100%" showToolbar={showToolbar}>
                <Document onRender={onPdfRender}>
                    <Page size="A4" style={styles.page}>
                        <PDFHeader
                            formData={formData.toJSON()}
                            activeStudy={activeStudy}
                            logoUrl={logoUrl}
                            qrCodeUrl={qrCodeUrl}
                            reportName={reportName}
                        />
                        <PDFReportContent formData={formData.toJSON()} />
                        <PDFFooter />
                    </Page>
                    <Page size="A4" style={styles.page}>
                        <PDFHeader
                            formData={formData.toJSON()}
                            activeStudy={activeStudy}
                            logoUrl={logoUrl}
                            qrCodeUrl={qrCodeUrl}
                            reportName={reportName}
                        />
                        <PDFPhoto
                            imageList={formData.get('ReportImageDataset')}
                            diagramData={diagramData}
                        />
                        <PDFFooter />
                    </Page>
                </Document>
            </PDFViewer>
        </Box>
    );
};

export default observer(PdfCreator);
