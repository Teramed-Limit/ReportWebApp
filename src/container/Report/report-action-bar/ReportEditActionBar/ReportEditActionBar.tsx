import React, { CSSProperties, useContext } from 'react';

import { observer } from 'mobx-react';
import { tap } from 'rxjs/operators';

import Modal from '../../../../components/Modal/Modal';
import PdfCreator from '../../../../components/PdfCreator/PdfCreator';
import Button from '../../../../components/UI/Button/Button';
import { ModalContext } from '../../../../context/modal-context';
import { NotificationContext } from '../../../../context/notification-context';
import { useReportDataStore } from '../../../../models/useStore';

const ReportEditActionBar: React.FC = () => {
    const { showNotifyMsg } = useContext(NotificationContext);
    const setModal = useContext(ModalContext);
    const { saveReport, signOffReport } = useReportDataStore();

    const openPreviewModal = (print: boolean): JSX.Element => {
        return (
            <Modal
                open
                width="80%"
                height="80%"
                overflow="hidden hidden"
                onClose={() => setModal(null)}
                headerTitle="PDF Preview"
                body={<PdfCreator showToolbar={print} />}
                bodyCSS={{ padding: '0' } as CSSProperties}
                footer={
                    <Button theme="reversePrimary" onClick={() => setModal(null)}>
                        Close
                    </Button>
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
        setModal(openPreviewModal(false));
    };

    const signOffReportAndPreviewPdf = () => {
        signOffReport(null, (signal$) =>
            signal$.pipe(
                tap(({ notification }) => {
                    setModal(openPreviewModal(true));
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
