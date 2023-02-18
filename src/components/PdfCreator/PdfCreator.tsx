import React, { useCallback, useState } from 'react';

import { Check } from '@mui/icons-material';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReactPDF, { Document, PDFViewer } from '@react-pdf/renderer';

import useLocalStorage from '../../hooks/useLocalStorage';
import { FormDefine, Section } from '../../interface/define';
import { RepPage } from '../../interface/rep-report';
import { useOptionStore, useReportDataStore, useReportImageStore } from '../../models/useStore';
import Block from '../Block/Block';
import Spinner from '../Spinner/Spinner';
import PDFCustomHeader from './PDFCustomHeader/PDFCustomHeader';
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

export const padding = 0.2;

const PdfCreator = ({
    showToolbar = false,
    pdfDefine,
    headerDefine,
    footerDefine,
    onPdfRenderCallback,
}: Props) => {
    const { formData, studyInsUID } = useReportDataStore();
    const { selectedImage, exportDiagramUrl } = useReportImageStore();

    const { getCodeList } = useOptionStore();
    const [row, setRow] = useLocalStorage('imagePerRow', 4);
    const [pageBreak, setPageBreak] = useLocalStorage('imagePageBreak', false);
    const [loading, setLoading] = useState(true);

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
            {
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
                            >
                                {selectedImage.length && (
                                    <PDFPhoto
                                        row={row}
                                        pageBreak={pageBreak}
                                        imageList={selectedImage}
                                    />
                                )}
                            </PDFReportContent>
                        </PDFPage>
                    </Document>
                </PDFViewer>
            }
        </Box>
    );
};

export default PdfCreator;
