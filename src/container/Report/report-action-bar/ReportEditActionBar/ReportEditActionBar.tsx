import React, { CSSProperties, useContext } from 'react';

import { Button as MaterialButton, Link } from '@mui/material';
import { observer } from 'mobx-react';
import { filter, tap } from 'rxjs/operators';

import Modal from '../../../../components/Modal/Modal';
import PdfCreator from '../../../../components/PdfCreator/PdfCreator';
import Button from '../../../../components/UI/Button/Button';
import { ModalContext } from '../../../../context/modal-context';
import { NotificationContext } from '../../../../context/notification-context';
import WithElementVisibility from '../../../../HOC/WithElementVisiblity/WithElementVisibility';
import { MessageType } from '../../../../interface/notification';
import { useReportDataStore } from '../../../../models/useStore';

const ReportEditActionBar: React.FC = () => {
    const { showNotifyMsg } = useContext(NotificationContext);
    const setModal = useContext(ModalContext);
    const { reportHasChanged, studyInsUID, saveReport, signOffReport, valueChanged } =
        useReportDataStore();

    const openPreviewModal = (isSignOff: boolean): JSX.Element => {
        return (
            <Modal
                open
                width="80%"
                height="80%"
                overflow="hidden hidden"
                headerTitle="PDF Preview"
                body={
                    <PdfCreator
                        showToolbar={isSignOff}
                        onPdfRenderCallback={isSignOff ? onSignOffReport : undefined}
                    />
                }
                bodyCSS={{ padding: '0' } as CSSProperties}
                footer={
                    <>
                        <MaterialButton
                            size="large"
                            variant="outlined"
                            onClick={() => setModal(null)}
                        >
                            Close
                        </MaterialButton>
                        {isSignOff && (
                            <>
                                <MaterialButton
                                    size="large"
                                    variant="contained"
                                    component={Link}
                                    download
                                    href={`${
                                        import.meta.env.VITE_BASE_URL
                                    }/api/report/studyInstanceUID/${studyInsUID}/downloadPDF`}
                                >
                                    Download
                                </MaterialButton>
                            </>
                        )}
                    </>
                }
            />
        );
    };

    const onSaveReport = (previewPdf) => {
        saveReport(null, (signal$) =>
            signal$.pipe(
                tap(({ notification }) => showNotifyMsg(notification)),
                filter(({ notification }) => notification.messageType !== MessageType.Error),
                filter(() => previewPdf),
                tap(() => setModal(openPreviewModal(false))),
            ),
        );
    };

    const onSignOffReport = (pdfBase64: string) => {
        valueChanged('PDFFilePath', pdfBase64);
        signOffReport(null, (signal$) =>
            signal$.pipe(tap(({ notification }) => showNotifyMsg(notification))),
        );
    };

    return (
        <>
            <Button
                disabled={!reportHasChanged}
                theme="primary"
                icon="save"
                iconPosition="left"
                fontSize={16}
                onClick={() => onSaveReport(false)}
            >
                Save
            </Button>
            <Button
                theme="primary"
                icon="preview"
                iconPosition="left"
                fontSize={16}
                onClick={() => onSaveReport(true)}
            >
                Preview
            </Button>
            <WithElementVisibility
                wrappedComp={
                    <Button
                        id="button__reportSignOff"
                        theme="primary"
                        icon="signOff"
                        iconPosition="left"
                        fontSize={16}
                        onClick={() => setModal(openPreviewModal(true))}
                    >
                        SignOff
                    </Button>
                }
            />
        </>
    );
};

export default observer(ReportEditActionBar);
