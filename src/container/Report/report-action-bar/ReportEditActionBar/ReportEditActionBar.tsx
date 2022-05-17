import React, { CSSProperties, useCallback, useContext } from 'react';

import { observer } from 'mobx-react';
import { tap } from 'rxjs/operators';

import Modal from '../../../../components/Modal/Modal';
import PdfCreator from '../../../../components/PdfCreator/PdfCreator';
import Button from '../../../../components/UI/Button/Button';
import { ModalContext } from '../../../../context/modal-context';
import { NotificationContext } from '../../../../context/notification-context';
import { MessageType } from '../../../../interface/notification';
import { useReportDataStore } from '../../../../models/useStore';

const ReportEditActionBar: React.FC = () => {
    const { showNotifyMsg } = useContext(NotificationContext);
    const setModal = useContext(ModalContext);
    const { saveReport, savePdf, signOffReport } = useReportDataStore();

    const openPreviewModal = (isSignOff: boolean): JSX.Element => {
        return (
            <Modal
                open
                width="80%"
                height="80%"
                overflow="hidden hidden"
                onClose={() => setModal(null)}
                headerTitle="PDF Preview"
                body={
                    <PdfCreator
                        showToolbar={isSignOff}
                        onRenderCallback={isSignOff ? onSavePdf : () => {}}
                    />
                }
                bodyCSS={{ padding: '0' } as CSSProperties}
                footer={
                    <Button theme="reversePrimary" onClick={() => setModal(null)}>
                        Close
                    </Button>
                }
            />
        );
    };

    const onSavePdf = useCallback(
        (blob: Blob, base64Str: string) => {
            savePdf(base64Str, (signal$) =>
                signal$.pipe(tap(({ notification }) => showNotifyMsg(notification))),
            );
        },
        [savePdf, showNotifyMsg],
    );

    const onSaveReport = useCallback(() => {
        saveReport(null, (signal$) =>
            signal$.pipe(tap(({ notification }) => showNotifyMsg(notification))),
        );
    }, [saveReport, showNotifyMsg]);

    const onPreviewReport = () => {
        saveReport(null, (signal$) =>
            signal$.pipe(
                tap(({ notification }) => {
                    showNotifyMsg(notification);
                    if (notification.messageType === MessageType.Error) return;
                    setModal(openPreviewModal(false));
                }),
            ),
        );
    };

    const onSignOffReport = () => {
        signOffReport(null, (signal$) =>
            signal$.pipe(
                tap(({ notification }) => {
                    showNotifyMsg(notification);
                    if (notification.messageType === MessageType.Error) return;
                    setModal(openPreviewModal(true));
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
                onClick={() => onSaveReport()}
            >
                Save
            </Button>
            <Button
                theme="primary"
                icon="preview"
                iconPosition="left"
                fontSize={16}
                onClick={() => onPreviewReport()}
            >
                Preview
            </Button>
            <Button
                theme="primary"
                icon="signOff"
                iconPosition="left"
                fontSize={16}
                onClick={() => onSignOffReport()}
            >
                SignOff
            </Button>
        </>
    );
};

export default observer(ReportEditActionBar);
