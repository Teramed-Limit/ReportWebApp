import React, { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ReactPDF, { Document, PDFViewer } from '@react-pdf/renderer';
import { observer } from 'mobx-react';
import Resizer from 'react-image-file-resizer';

import { axiosIns } from '../../axios/axios';
import { ReportImageDataset } from '../../interface/document-data';
import { UserSignature } from '../../interface/user-signature';
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
    const { formData, studyInsUID } = useReportDataStore();
    const { exportDiagramUrl } = useReportImageStore();
    const { pdfDefine } = useReportDefineStore();
    const { getCodeList } = useOptionStore();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<ReportImageDataset[] | undefined>(undefined);
    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
    const [signatureData, setSignatureData] = useState<UserSignature | undefined>(undefined);
    const [diagramUrl, setDiagramUrl] = useState<string | undefined>(undefined);
    const [reportName] = useState<string>(
        getCodeList('ReportTitle').find((x) => x.Label === formData.get('ReportTemplate'))?.Value ||
            '',
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

    // Resizing image
    useEffect(() => {
        const concatImage = async () => {
            const imageList = formData.get('ReportImageDataset') as ReportImageDataset[];
            return Promise.all<ReportImageDataset>(
                (imageList || [])
                    .filter((image) => image.IsAttachInReport)
                    .map(async (image): Promise<ReportImageDataset> => {
                        const base64 = await resizeImage(image.ImageSrc);
                        return { ...image, ImageSrc: base64 };
                    }),
            );
        };

        concatImage().then((resizeImageList) => {
            const sortImages = resizeImageList?.sort((a, b) => {
                const numA = +a.MappingNumber;
                const numB = +b.MappingNumber;

                if (numA === 0 || numB === 0) {
                    return 0;
                }

                if (numA < numB) {
                    return -1;
                }
                if (numA > numB) {
                    return 1;
                }
                return 0;
            });
            setImages(sortImages);
        });
    }, [formData]);

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
        if (!formData.get('Endoscopist')) return;

        const subscription = axiosIns
            .get<UserSignature>(`api/account/signature/userId/${formData.get('Endoscopist')}`)
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
            {images && logoUrl && signatureData && diagramUrl && (
                <PDFViewer width="100%" height="100%" showToolbar={showToolbar}>
                    <Document
                        title={`${formData.get('PatientId')}_${formData.get('PatientsName')}`}
                        author={formData.get('Author')}
                        subject={studyInsUID}
                        onRender={onPdfRender}
                    >
                        <PDFPage
                            signatureData={signatureData}
                            logoUrl={logoUrl}
                            reportName={reportName}
                        >
                            <PDFReportContent
                                formSections={pdfDefine.sections}
                                formData={formData.toJSON()}
                                diagramUrl={diagramUrl}
                                getOptions={getCodeList}
                            />
                            <PDFPhoto imageList={images} />
                        </PDFPage>
                    </Document>
                </PDFViewer>
            )}
        </Box>
    );
};

export default observer(PdfCreator);
