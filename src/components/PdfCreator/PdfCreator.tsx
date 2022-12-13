import React, { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ReactPDF, { Document, PDFViewer } from '@react-pdf/renderer';

import { axiosIns } from '../../axios/axios';
import { Section } from '../../interface/define';
import { DoctorSignature } from '../../interface/doctor-signature';
import {
    useOptionStore,
    useReportDataStore,
    useReportDefineStore,
    useReportImageStore,
} from '../../models/useStore';
import ConfigService from '../../service/config-service';
import Block from '../Block/Block';
import Spinner from '../Spinner/Spinner';
import PDFFooter from './PDFFooter/PDFFooter';
import PDFHeader from './PDFHeader/PDFHeader';
import PDFPage from './PDFPage/PDFPage';
import PDFPhoto from './PDFPhoto/PDFPhoto';
import PDFReportContent from './PDFReportContent/PDFReportContent';

interface Props {
    showToolbar?: boolean;
    onPdfRenderCallback?: (base64: string) => void;
}

const PdfCreator = ({ showToolbar = false, onPdfRenderCallback }: Props) => {
    const { formData, studyInsUID } = useReportDataStore();
    const { exportDiagramUrl, selectedImage } = useReportImageStore();
    const { pdfDefine } = useReportDefineStore();
    const { getCodeList } = useOptionStore();
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
    const [signatureData, setSignatureData] = useState<DoctorSignature | undefined>(undefined);
    const [diagramUrl, setDiagramUrl] = useState<string | undefined>(undefined);
    const [reportName] = useState<string>(
        getCodeList('ReportTitle').find((x) => x.Label === formData.get('ReportTemplate'))?.Value ||
            '',
    );

    const onPdfRender = useCallback(
        (renderProps: ReactPDF.OnRenderProps) => {
            setLoading(false);
            if (!renderProps?.blob) return;
            const reader = new FileReader();
            reader.readAsDataURL(renderProps.blob);
            reader.onloadend = () => {
                setTimeout(() => {
                    if (!renderProps?.blob || !reader?.result) return;
                    const pdfBase64 = (reader.result as string).replace(
                        'data:application/pdf;base64,',
                        '',
                    );
                    onPdfRenderCallback?.(pdfBase64);
                });
                setLoading(false);
            };
        },
        [onPdfRenderCallback],
    );

    // Get hospital logo
    useEffect(() => {
        const subscription = axiosIns.get<string>('api/logo').subscribe((res) => {
            setLogoUrl(res.data);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Get diagram
    useEffect(() => {
        setDiagramUrl(exportDiagramUrl());
    }, [exportDiagramUrl]);

    // Get signature
    useEffect(() => {
        const subscription = axiosIns
            .get<DoctorSignature>(
                `api/doctor-signature/userId/${formData.get(
                    ConfigService.getSignatureCorrespondingField(),
                )}`,
            )
            .subscribe((res) => {
                setSignatureData(res.data);
            });

        return () => subscription.unsubscribe();
    }, [formData]);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            {loading && (
                <Block enableScroll>
                    <Spinner />
                </Block>
            )}
            {logoUrl && signatureData && diagramUrl && (
                <PDFViewer width="100%" height="100%" showToolbar={showToolbar}>
                    <Document
                        title={`${formData.get('PatientId')}_${formData.get('PatientsName')}`}
                        author={formData.get('Author')}
                        subject={studyInsUID}
                        onRender={onPdfRender}
                    >
                        <PDFPage>
                            {/* Header */}
                            <PDFHeader logoUrl={logoUrl} reportName={reportName}>
                                <PDFReportContent
                                    formSections={pdfDefine.sections.filter(
                                        (section: Section) => section.isHeader,
                                    )}
                                    formData={formData.toJSON()}
                                    diagramUrl={diagramUrl}
                                    getOptions={getCodeList}
                                />
                            </PDFHeader>
                            {/* Body */}
                            <PDFReportContent
                                formSections={pdfDefine.sections.filter(
                                    (section: Section) => !section?.isHeader,
                                )}
                                formData={formData.toJSON()}
                                diagramUrl={diagramUrl}
                                getOptions={getCodeList}
                            />
                            {selectedImage.length && <PDFPhoto imageList={selectedImage} />}
                            {/* Footer */}
                            <PDFFooter signatureData={signatureData} />
                        </PDFPage>
                    </Document>
                </PDFViewer>
            )}
        </Box>
    );
};

export default PdfCreator;
