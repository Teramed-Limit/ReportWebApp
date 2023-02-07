import React, { useCallback, useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ReactPDF, { Document, PDFViewer } from '@react-pdf/renderer';

import { axiosIns } from '../../axios/axios';
import { NotificationContext } from '../../context/notification-context';
import { FormDefine, Section } from '../../interface/define';
import { DoctorSignature } from '../../interface/doctor-signature';
import { RepPage } from '../../interface/rep-report';
import { useOptionStore, useReportDataStore, useReportImageStore } from '../../models/useStore';
import ConfigService from '../../service/config-service';
import { isEmptyOrNil } from '../../utils/general';
import Block from '../Block/Block';
import Spinner from '../Spinner/Spinner';
import PDFCustomHeader from './PDFCustomHeader/PDFCustomHeader';
import PDFFooter from './PDFFooter/PDFFooter';
import PDFPage from './PDFPage/PDFPage';
import PDFPhoto from './PDFPhoto/PDFPhoto';
import PDFReportContent from './PDFReportContent/PDFReportContent';

interface Props {
    showToolbar?: boolean;
    pdfDefine: FormDefine;
    headerDefine: RepPage;
    footerDefine: RepPage;
    onPdfRenderCallback?: (base64: string) => void;
}

const PdfCreator = ({
    showToolbar = false,
    pdfDefine,
    headerDefine,
    footerDefine,
    onPdfRenderCallback,
}: Props) => {
    const { setErrorNotification } = useContext(NotificationContext);
    const { formData, studyInsUID } = useReportDataStore();
    const { selectedImage, exportDiagramUrl } = useReportImageStore();

    const { getCodeList } = useOptionStore();
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
    const [signatureData, setSignatureData] = useState<DoctorSignature | undefined>(undefined);
    const [reportName] = useState<string>(
        getCodeList('ReportTitle').find((x) => x.Label === formData.get('ReportTemplate'))?.Value ||
            '',
    );

    const diagramUrl = exportDiagramUrl();

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

    // Get signature
    useEffect(() => {
        const signatureField = ConfigService.getSignatureCorrespondingField();
        const signatureValue = formData.get(ConfigService.getSignatureCorrespondingField());

        if (isEmptyOrNil(signatureValue)) {
            setErrorNotification(`Get signature error, ${signatureField} is empty`);
            return;
        }

        const subscription = axiosIns
            .get<DoctorSignature>(`api/doctor-signature/userId/${signatureValue}`)
            .subscribe({
                next: (res) => {
                    setSignatureData(res.data);
                },
                error: () => {
                    setErrorNotification(`Get signature error, ${signatureValue} not found`);
                },
            });

        return () => subscription.unsubscribe();
    }, [formData, setErrorNotification]);

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
            {logoUrl && signatureData && (
                <PDFViewer width="100%" height="100%" showToolbar={showToolbar}>
                    <Document
                        title={`${formData.get('PatientId')}_${formData.get('PatientsName')}`}
                        author={formData.get('Author')}
                        subject={studyInsUID}
                        onRender={onPdfRender}
                    >
                        <PDFPage>
                            {/* Header */}
                            <PDFCustomHeader components={headerDefine.components}>
                                <PDFReportContent
                                    formSections={pdfDefine.sections.filter(
                                        (section: Section) => section.isHeader,
                                    )}
                                    formData={formData.toJSON()}
                                    diagramUrl={diagramUrl}
                                    getOptions={getCodeList}
                                />
                            </PDFCustomHeader>
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
