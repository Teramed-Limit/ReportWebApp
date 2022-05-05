import React, { useCallback, useEffect, useState } from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import ReactPDF, { Document, Page, PDFViewer } from '@react-pdf/renderer';
import BwipJs from 'bwip-js';
import { observer } from 'mobx-react';
import Resizer from 'react-image-file-resizer';

import { axiosIns } from '../../axios/axios';
import { ReportImageDataset } from '../../interface/document-data';
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
    onRenderCallback?: (blob: Blob, base64: string) => void;
}

const PdfCreator = ({ showToolbar, onRenderCallback }: Props) => {
    const { formData, activeStudy, diagramData, studyInsUID } = useReportDataStore();
    const { getOptions } = useOptionStore();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<ReportImageDataset[] | undefined>(undefined);
    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
    const [qrCodeUrl, setQRCodeUrl] = useState<string | undefined>(undefined);
    const [photoLayout, setPhotoLayout] = useState<{ row: number; col: number }>({
        row: 3,
        col: 3,
    });
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

    const onLayoutChanged = useCallback(
        (event: React.MouseEvent<HTMLElement>, layout: { row: number; col: number }) => {
            setPhotoLayout(layout);
        },
        [],
    );

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
                        // Jpeg file format (as many others) can be identified by magic number.
                        // For JPEG the magic number is ff d8 ff at offset 0.
                        // If you encode this to Base64, you'll always get /9j/.
                        ImageSrc: `data:image/${
                            diagramData?.substr(0, 4) === '/9j/' ? 'jpg' : 'png'
                        };base64,${diagramData}`,
                        IsAttachInReport: true,
                        MappingNumber: -1,
                        DescriptionOfFindings: '',
                    },
                ],
                ...resizeImageList,
            ]);
        });
    }, [diagramData, formData]);

    // Get hospital logo
    useEffect(() => {
        const subscription = axiosIns
            .get<string>('api/logo')
            .subscribe((res) => setLogoUrl(res.data));
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

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <canvas style={{ display: 'none' }} id="qrcode" />
            {loading && (
                <Block>
                    <Spinner />
                </Block>
            )}
            <ToggleButtonGroup
                sx={{ borderRadius: '0' }}
                value={photoLayout}
                exclusive
                onChange={onLayoutChanged}
            >
                <ToggleButton value={{ row: 2, col: 2 }}>2*2</ToggleButton>
                <ToggleButton value={{ row: 2, col: 3 }}>2*3</ToggleButton>
                <ToggleButton value={{ row: 3, col: 3 }}>3*3</ToggleButton>
            </ToggleButtonGroup>
            {images && logoUrl && qrCodeUrl && (
                <PDFViewer width="100%" height="100%" showToolbar={showToolbar}>
                    <Document
                        title={`${activeStudy.PatientId}_${activeStudy.PatientsName}`}
                        author={formData.get('Author')}
                        subject={studyInsUID}
                        onRender={onPdfRender}
                    >
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
                                imageList={images}
                                row={photoLayout.row}
                                col={photoLayout.col}
                            />
                            <PDFFooter />
                        </Page>
                    </Document>
                </PDFViewer>
            )}
        </Box>
    );
};

export default observer(PdfCreator);
