import React, { useCallback, useContext, useEffect, useState } from 'react';

import { observer } from 'mobx-react';
import { tap } from 'rxjs/operators';

import { NotificationContext } from '../../context/notification-context';
import { MessageType } from '../../interface/notification';
import { useReportDataStore } from '../../models/useStore';
import { generateUUID } from '../../utils/general';
import ButtonGroup from '../UI/Button-Group/Button-Group';
import Button from '../UI/Button/Button';
import classes from './Header.module.css';

const Header = () => {
    const { pdfFile } = useReportDataStore();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [printable, setPrintable] = useState<boolean>(false);
    const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
    const {
        patientHeaderInfo,
        saveReport,
        signOffReport,
        modify,
        reportDisabled,
        reportHasSignOff,
    } = useReportDataStore();
    const iframeRef = React.useRef() as React.MutableRefObject<HTMLIFrameElement>;

    const genPdfIframeSrc = useCallback(
        (file: string, print: boolean) => {
            fetch(`${file}?a=${generateUUID()}`)
                .then((response) => response.arrayBuffer())
                .then((buffer) => {
                    const pdfBlob = new window.Blob([buffer], { type: 'application/pdf' });
                    setPdfUrl(window.URL.createObjectURL(pdfBlob));
                    setPrintable(print);
                })
                .catch((err) => {
                    console.error(err);
                    setErrorNotification('pdf not found.');
                });
        },
        [setErrorNotification],
    );

    useEffect(() => {
        if (!pdfFile) return;
        genPdfIframeSrc(pdfFile, false);
    }, [genPdfIframeSrc, pdfFile]);

    const printPdf = () => {
        if (iframeRef?.current?.contentWindow) {
            iframeRef.current.contentWindow.print();
        }
    };

    const iframeOnLoad = (e: any) => {
        if (!printable) return;
        e.target.contentWindow.print();
    };

    const showNotifyMsg = (notification) => {
        return notification.messageType === MessageType.Success
            ? setSuccessNotification(notification.message)
            : setErrorNotification(notification.message);
    };

    const signOffReportRouteToPreviewPage = () => {
        signOffReport(null, (signal$) =>
            signal$.pipe(
                tap(({ notification, response }) => {
                    showNotifyMsg(notification);
                    if (!response?.PDFFilePath) return;
                    genPdfIframeSrc(response?.PDFFilePath, true);
                }),
            ),
        );
    };

    const saveReportAndNotify = () => {
        saveReport(null, (signal$) =>
            signal$.pipe(tap(({ notification }) => showNotifyMsg(notification))),
        );
    };

    return (
        <div className={classes.header}>
            {reportHasSignOff && pdfUrl ? (
                <iframe
                    ref={iframeRef}
                    id="iFramePrinter"
                    title="iFramePrinter"
                    style={{ display: 'none' }}
                    src={pdfUrl}
                    onLoad={iframeOnLoad}
                />
            ) : null}
            <div className={classes.headerInfo}>{patientHeaderInfo}</div>
            <div className={classes.headerSidebar}>
                <ButtonGroup>
                    <Button id="btn__save" icon="save" color="black" onClick={saveReportAndNotify}>
                        Save
                    </Button>
                    <Button
                        id="btn__modify"
                        disabled={!reportDisabled}
                        icon="modify"
                        color="black"
                        onClick={modify}
                    >
                        Modify
                    </Button>
                    <Button
                        id="btn__sign"
                        disabled={reportDisabled}
                        color="black"
                        icon="signOffBlue"
                        onClick={signOffReportRouteToPreviewPage}
                    >
                        SignOffs
                    </Button>
                    <Button
                        id="btn__print"
                        disabled={!reportDisabled}
                        icon="print"
                        color="black"
                        onClick={printPdf}
                    >
                        Print
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default observer(Header);
