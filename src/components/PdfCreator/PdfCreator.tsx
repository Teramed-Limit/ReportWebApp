import React, { useCallback, useEffect, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import ReactPDF, { Document, PDFViewer } from '@react-pdf/renderer';
import BwipJs from 'bwip-js';
import { observer } from 'mobx-react';
import Resizer from 'react-image-file-resizer';

import { axiosIns } from '../../axios/axios';
import { ReportImageDataset } from '../../interface/document-data';
import { ReportTemplateList } from '../../interface/report-setting';
import {
    useOptionStore,
    useReportDataStore,
    useReportDefineStore,
    useReportImageStore,
} from '../../models/useStore';
import Block from '../Block/Block';
import Spinner from '../Spinner/Spinner';
import PDFPage from './PDFPage/PDFPage';
import PDFPhoto from './PDFPhoto/PDFPhoto';
import PDFReportContent from './PDFReportContent/PDFReportContent';

interface Props {
    showToolbar: boolean;
    onRenderCallback?: (blob: Blob, base64: string) => void;
}

const PdfCreator = ({ showToolbar, onRenderCallback }: Props) => {
    const { formData, activeStudy, studyInsUID } = useReportDataStore();
    const { exportDiagramUrl } = useReportImageStore();
    const { pdfDefine } = useReportDefineStore();
    const { getOptions } = useOptionStore();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<ReportImageDataset[] | undefined>(undefined);
    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
    const [qrCodeUrl, setQRCodeUrl] = useState<string | undefined>(undefined);
    const [photoLayout, setPhotoLayout] = useState<string>(JSON.stringify({ row: 3, col: 3 }));
    const [reportName] = useState<string>(
        (getOptions('ReportTemplateList').find(
            (x) => x.Name === formData.get('ReportTemplate'),
        ) as ReportTemplateList)?.ReportName || '內視鏡報告',
    );

    const resizeImage = (url) => {
        return fetch(url)
            .then((response) => response.blob())
            .then((blob: Blob) => {
                return new Promise<string>((resolve) => {
                    Resizer.imageFileResizer(
                        blob,
                        300,
                        300,
                        'JPEG',
                        100,
                        0,
                        (uri) => resolve(uri as string),
                        'base64',
                    );
                });
            });
    };

    const onPdfRender = useCallback(
        (renderProps: ReactPDF.OnRenderProps) => {
            setLoading(false);
            if (!renderProps?.blob) return;
            const reader = new FileReader();
            reader.readAsDataURL(renderProps.blob);
            reader.onloadend = () => {
                setTimeout(() => {
                    if (!renderProps?.blob || !reader?.result) return;
                    onRenderCallback?.(
                        renderProps.blob,
                        (reader.result as string).replace('data:application/pdf;base64,', ''),
                    );
                });
                setLoading(false);
            };
        },
        [onRenderCallback],
    );

    const onLayoutChanged = (event) => {
        setPhotoLayout(event.target.value);
    };

    // Resizing image
    useEffect(() => {
        const concatImage = async () => {
            return Promise.all<ReportImageDataset>(
                (formData.get('ReportImageDataset') as ReportImageDataset[])
                    .filter((image) => image.IsAttachInReport)
                    .map(
                        async (image): Promise<ReportImageDataset> => {
                            const base64 = await resizeImage(image.ImageSrc);
                            return { ...image, ImageSrc: base64 };
                        },
                    ),
            );
        };

        concatImage().then((resizeImageList) => {
            setImages([
                ...[
                    {
                        SOPInstanceUID: 'Diagram',
                        ImageSrc: exportDiagramUrl(),
                        IsAttachInReport: true,
                        MappingNumber: -1,
                        DescriptionOfFindings: '',
                    },
                ],
                ...resizeImageList,
            ]);
        });
    }, [exportDiagramUrl, formData]);

    // Get hospital logo
    useEffect(() => {
        const subscription = axiosIns
            .get<string>('api/logo')
            .subscribe((res) => setLogoUrl(`${res.data}?${new Date()}`));
        return () => subscription.unsubscribe();
    }, [activeStudy.PatientId]);

    // Get qrcode
    useEffect(() => {
        const qrCode = BwipJs.toCanvas('qrcode', {
            bcid: 'qrcode', // Barcode type
            text: activeStudy?.PatientId || 'Undefined', // Text to encode
            scale: 1, // 3x scaling factor
            height: 75, // Bar height, in millimeters
            width: 75, // Bar height, in millimeters
            includetext: false, // Show human-readable text
            textxalign: 'center', // Always good to set this
        }).toDataURL('image/png');
        setQRCodeUrl(qrCode);
    }, [activeStudy.PatientId]);

    // Get diagram
    useEffect(() => {}, []);

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
            <canvas style={{ display: 'none' }} id="qrcode" />
            {loading && (
                <Block enableScroll>
                    <Spinner />
                </Block>
            )}

            <Box sx={{ padding: '8px' }}>
                <FormControl sx={{ width: '120px' }}>
                    <InputLabel>Photo Layout</InputLabel>
                    <Select value={photoLayout} label="Photo Layout" onChange={onLayoutChanged}>
                        <MenuItem value={JSON.stringify({ row: 2, col: 2 })}>2 * 2</MenuItem>
                        <MenuItem value={JSON.stringify({ row: 2, col: 3 })}>2 * 3</MenuItem>
                        <MenuItem value={JSON.stringify({ row: 3, col: 3 })}>3 * 3</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {images && logoUrl && qrCodeUrl && (
                <PDFViewer width="100%" height="100%" showToolbar={showToolbar}>
                    <Document
                        title={`${activeStudy.PatientId}_${activeStudy.PatientsName}`}
                        author={formData.get('Author')}
                        subject={studyInsUID}
                        onRender={onPdfRender}
                    >
                        <PDFPage
                            formData={formData.toJSON()}
                            activeStudy={activeStudy}
                            logoUrl={logoUrl}
                            qrCodeUrl={qrCodeUrl}
                            reportName={reportName}
                        >
                            <PDFReportContent
                                formSections={pdfDefine.sections}
                                formData={formData.toJSON()}
                                getOptions={getOptions}
                            />
                        </PDFPage>

                        {pdfDefine?.modal?.modalName === 'colonoscopyQualityIndicators' && (
                            <PDFPage
                                formData={formData.toJSON()}
                                activeStudy={activeStudy}
                                logoUrl={logoUrl}
                                qrCodeUrl={qrCodeUrl}
                                reportName={reportName}
                            >
                                <PDFReportContent
                                    formSections={pdfDefine.modal.sections}
                                    formData={formData.toJSON()}
                                    getOptions={getOptions}
                                />
                            </PDFPage>
                        )}

                        <PDFPage
                            formData={formData.toJSON()}
                            activeStudy={activeStudy}
                            logoUrl={logoUrl}
                            qrCodeUrl={qrCodeUrl}
                            reportName={reportName}
                        >
                            <PDFPhoto
                                imageList={images}
                                row={JSON.parse(photoLayout).row}
                                col={JSON.parse(photoLayout).col}
                            />
                        </PDFPage>
                    </Document>
                </PDFViewer>
            )}
        </Box>
    );
};

export default observer(PdfCreator);
