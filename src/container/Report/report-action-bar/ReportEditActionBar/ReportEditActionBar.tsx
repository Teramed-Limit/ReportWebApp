import React, { useContext } from 'react';

import { observer } from 'mobx-react';
import { tap } from 'rxjs/operators';

import Modal from '../../../../components/Modal/Modal';
import PdfPreview from '../../../../components/PdfPreview/PdfPreview';
import Button from '../../../../components/UI/Button/Button';
import { ModalContext } from '../../../../context/modal-context';
import { NotificationContext } from '../../../../context/notification-context';
import { useReportDataStore } from '../../../../models/useStore';
import { generateUUID } from '../../../../utils/general';

const ReportEditActionBar: React.FC = () => {
    const { showNotifyMsg, setErrorNotification } = useContext(NotificationContext);
    const setModal = useContext(ModalContext);
    const { saveReport, previewReport, signOffReport } = useReportDataStore();

    // const print = (file: string) => {
    //     fetch(`${file}?a=${generateUUID()}`)
    //         .then((response) => response.arrayBuffer())
    //         .then((buffer) => {
    //             const pdfBlob = new window.Blob([buffer], { type: 'application/pdf' });
    //             setPdfUrl(window.URL.createObjectURL(pdfBlob));
    //             setPrintable(print);
    //         });
    // };

    const openPreviewModal = (pdf): JSX.Element => {
        if (!pdf) {
            setErrorNotification('Pdf not found');
            return <></>;
        }

        return (
            <Modal
                open
                width="80%"
                height="80%"
                overflow="hidden auto"
                onClose={() => setModal(null)}
                headerTitle="PDF Preview"
                body={<PdfPreview pdfUrl={pdf} />}
                footer={
                    <>
                        <Button theme="reversePrimary" onClick={() => setModal(null)}>
                            Ok
                        </Button>
                        <Button theme="primary" onClick={() => setModal(null)}>
                            Print
                        </Button>
                    </>
                }
            />
        );
    };

    const saveReportAndNotify = () => {
        saveReport(null, (signal$) =>
            signal$.pipe(tap(({ notification }) => showNotifyMsg(notification))),
        );
    };

    const previewReportAndPopPDFModal = () => {
        previewReport(null, (signal$) =>
            signal$.pipe(
                tap(({ response }) => {
                    setModal(openPreviewModal(response?.PDFFilePath));
                }),
            ),
        );
    };

    const signOffReportAndPreviewPdf = () => {
        signOffReport(null, (signal$) =>
            signal$.pipe(
                tap(({ notification, response }) => {
                    setModal(openPreviewModal(response?.PDFFilePath));
                    showNotifyMsg(notification);
                }),
            ),
        );
    };

    return (
        <>
            <Button
                theme="primary"
                icon="save"
                iconPosition="left"
                fontSize={16}
                onClick={() => saveReportAndNotify()}
            >
                Save
            </Button>
            <Button
                theme="primary"
                icon="preview"
                iconPosition="left"
                fontSize={16}
                onClick={() => previewReportAndPopPDFModal()}
            >
                Preview
            </Button>
            <Button
                theme="primary"
                icon="signOff"
                iconPosition="left"
                fontSize={16}
                onClick={() => signOffReportAndPreviewPdf()}
            >
                SignOff
            </Button>
        </>
    );
};

export default observer(ReportEditActionBar);
