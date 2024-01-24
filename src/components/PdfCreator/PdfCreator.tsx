import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Check } from '@mui/icons-material';
import { Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReactPDF, { Document, PDFViewer } from '@react-pdf/renderer';
import { Observable, Subject } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

import classes from './PdfCreator.module.scss';
import PDFPhoto from './PDFPhoto/PDFPhoto';
import PDFReportContent from './PDFReportContent/PDFReportContent';
import PDFReportFooter from './PDFReportFooter/PDFReportFooter';
import PDFReportHeader from './PDFReportHeader/PDFReportHeader';
import { styles } from './styles/style';
import { httpReq } from '../../axios/axios';
import useLocalStorage from '../../hooks/useLocalStorage';
import { LoginResult, UserAccountInfo } from '../../interface/auth';
import { FormDefine, Section } from '../../interface/define';
import { Field } from '../../interface/report-field/field';
import { RepPage } from '../../interface/report-generator/rep-page';
import { useOptionStore, useReportDataStore, useReportImageStore } from '../../models/useStore';
import ConfigService from '../../service/config-service';
import LocalStorageService from '../../service/local-storage-service';
import Block from '../Block/Block';
import Spinner from '../Spinner/Spinner';

interface Props {
    showToolbar?: boolean;
    formDefine: FormDefine;
    imageDefine: Field[];
    headerDefine: RepPage;
    footerDefine: RepPage;
    onPdfRenderCallback?: (base64: string) => void;
}

export const padding = 0.2;

const PdfCreator = ({
    showToolbar = false,
    formDefine,
    imageDefine,
    headerDefine,
    footerDefine,
    onPdfRenderCallback,
}: Props) => {
    // 創建一個 Subject，監控 PDF 渲染狀態
    const onPdfRenderSubject = useRef(new Subject<Blob>());
    const { formData, studyInsUID } = useReportDataStore();
    const { selectedImage, exportDiagramUrl } = useReportImageStore();

    const { getCodeList } = useOptionStore();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState<UserAccountInfo | undefined>(undefined);

    // pdf style config
    const [row, setRow] = useLocalStorage('imagePerRow', 4);
    const [pageBreak, setPageBreak] = useLocalStorage('imagePageBreak', false);
    const [pagePadding, setPagePadding] = useLocalStorage('pagePadding', 8);

    const pdfStyle: {
        imagePerRow: number;
        imagePageBreak: boolean;
        pagePadding: number;
    } = {
        imagePerRow: row || 4,
        imagePageBreak: pageBreak || false,
        pagePadding: pagePadding || 8,
    };

    const diagramUrl = exportDiagramUrl();

    // 確保就算onPdfRender，render好幾次，也只會執行一次callback
    const onPdfRender = useCallback((renderProps: ReactPDF.OnRenderProps) => {
        if (!renderProps?.blob) return;
        onPdfRenderSubject.current.next(renderProps.blob);
    }, []);

    // Get signature and user data
    useEffect(() => {
        let userId = LocalStorageService.getFromLocalStorage<LoginResult>('user')?.UserId;
        if (ConfigService.getSignatureCorrespondingField() !== '')
            userId = formData.get(ConfigService.getSignatureCorrespondingField());

        const subscription = httpReq<UserAccountInfo>()({
            method: 'get',
            url: `api/account/${userId}`,
        })
            .pipe(map((res) => res.data))
            .subscribe({
                next: (value) => {
                    setUserData(value);
                },
                error: () => {
                    setLoading(false);
                    setError('Signature not found');
                },
            });

        return () => subscription.unsubscribe();
    }, [formData]);

    // 配合上方的onPdfRender，利用switchMap確保只會執行一次callback
    useEffect(() => {
        const subscription = onPdfRenderSubject.current
            .pipe(
                switchMap(
                    (blob: Blob) =>
                        new Observable<Blob>((observer) => {
                            observer.next(blob);
                            observer.complete();
                        }),
                ),
                finalize(() => setLoading(false)),
            )
            .subscribe((blob: Blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const pdfBase64 = reader.result as string;
                    onPdfRenderCallback?.(pdfBase64);
                    onPdfRenderSubject.current.complete();
                };
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [onPdfRenderCallback]);

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

                <Stack direction="column" sx={{ width: '100px' }}>
                    <Typography variant="caption" component="div">
                        Page Padding
                    </Typography>
                    <TextField
                        type="number"
                        inputProps={{ min: 0 }}
                        value={pagePadding}
                        onChange={(event) => {
                            setPagePadding(parseInt(event.target.value, 10));
                        }}
                    />
                </Stack>
            </Stack>
            {loading && (
                <Block enableScroll>
                    <Spinner />
                </Block>
            )}
            {error && (
                <>
                    <Typography className={classes.error} variant="h6" component="div">
                        {error}
                    </Typography>
                </>
            )}

            {userData && (
                <PDFViewer width="100%" height="100%" showToolbar={showToolbar}>
                    <Document
                        title={`${formData.get('PatientId')}_${formData.get('PatientsName')}`}
                        author={formData.get('Author')}
                        subject={studyInsUID}
                        onRender={onPdfRender}
                    >
                        <ReactPDF.Page
                            size="A4"
                            style={{
                                ...styles.page,
                                paddingBottom: footerDefine.height,
                            }}
                        >
                            {/* Header */}
                            <PDFReportHeader
                                formData={formData.toJSON()}
                                userData={userData}
                                page={headerDefine}
                            >
                                <PDFReportContent
                                    pagePadding={pagePadding}
                                    formSections={formDefine.sections.filter(
                                        (section: Section) => section.isHeader,
                                    )}
                                    formData={formData.toJSON()}
                                    diagramUrl={diagramUrl}
                                    getOptions={getCodeList}
                                />
                            </PDFReportHeader>
                            {/* Body */}
                            <PDFReportContent
                                pagePadding={pagePadding}
                                formSections={formDefine.sections.filter(
                                    (section: Section) => !section?.isHeader,
                                )}
                                formData={formData.toJSON()}
                                diagramUrl={diagramUrl}
                                getOptions={getCodeList}
                            />
                            {selectedImage.length > 0 && (
                                <PDFPhoto
                                    pdfStyle={pdfStyle}
                                    imageDefine={imageDefine}
                                    imageList={selectedImage}
                                />
                            )}
                            {/* Footer */}
                            <PDFReportFooter
                                formData={formData.toJSON()}
                                userData={userData}
                                page={footerDefine}
                            />
                        </ReactPDF.Page>
                    </Document>
                </PDFViewer>
            )}
        </Box>
    );
};

export default PdfCreator;
