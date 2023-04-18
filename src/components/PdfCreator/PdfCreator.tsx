import React, { useCallback, useEffect, useState } from 'react';

import { Check } from '@mui/icons-material';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReactPDF, { Document, PDFViewer } from '@react-pdf/renderer';
import { map } from 'rxjs/operators';

import { httpReq } from '../../axios/axios';
import useLocalStorage from '../../hooks/useLocalStorage';
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

export const padding = 0.2;

const PdfCreator = ({ showToolbar = false, onPdfRenderCallback }: Props) => {
    const { formData, studyInsUID } = useReportDataStore();
    const { selectedImage, exportDiagramUrl } = useReportImageStore();
    const { pdfDefine } = useReportDefineStore();
    const { getCodeList } = useOptionStore();
    const [row, setRow] = useLocalStorage('imagePerRow', 4);
    const [pageBreak, setPageBreak] = useLocalStorage('imagePageBreak', false);
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
        const subscription = httpReq<string>()({
            method: 'get',
            url: 'api/logo',
        })
            .pipe(map((res) => res.data))
            .subscribe((value) => {
                setLogoUrl(value);
            });

        return () => subscription.unsubscribe();
    }, []);

    // Get signature
    useEffect(() => {
        const subscription = httpReq<DoctorSignature>()({
            method: 'get',
            url: `api/doctor-signature/userId/${formData.get(
                ConfigService.getSignatureCorrespondingField(),
            )}`,
        }).subscribe((res) => {
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
            <Stack spacing={1} direction="row" style={{ padding: '6px' }}>
                <Stack direction="column">
                    <Typography variant="caption" component="div">
                        Image per row
                    </Typography>
                    <ToggleButtonGroup
                        size="small"
                        color="warning"
                        value={row}
                        exclusive
                        onChange={(event: React.MouseEvent<HTMLElement>, value: number) =>
                            setRow(value)
                        }
                    >
                        <ToggleButton value={1}>1</ToggleButton>
                        <ToggleButton value={2}>2</ToggleButton>
                        <ToggleButton value={3}>3</ToggleButton>
                        <ToggleButton value={4}>4</ToggleButton>
                        <ToggleButton value={5}>5</ToggleButton>
                        <ToggleButton value={6}>6</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                <Stack direction="column">
                    <Typography variant="caption" component="div">
                        Page break (Image)
                    </Typography>
                    <ToggleButton
                        sx={{ width: '36px' }}
                        size="small"
                        color="warning"
                        value="check"
                        selected={pageBreak}
                        onChange={() => setPageBreak(!pageBreak)}
                    >
                        <Check />
                    </ToggleButton>
                </Stack>
            </Stack>
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
                            {selectedImage.length && (
                                <PDFPhoto
                                    row={row}
                                    pageBreak={pageBreak}
                                    imageList={selectedImage}
                                />
                            )}
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
