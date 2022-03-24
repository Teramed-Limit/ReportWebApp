import React, { useCallback, useContext, useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CakeIcon from '@mui/icons-material/Cake';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import WcIcon from '@mui/icons-material/Wc';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react';
import { AiOutlineFieldNumber } from 'react-icons/all';
import { tap } from 'rxjs/operators';

import { NotificationContext } from '../../context/notification-context';
import { useReportDataStore } from '../../models/useStore';
import { generateUUID } from '../../utils/general';
import ButtonGroup from '../UI/Button-Group/Button-Group';
import Button from '../UI/Button/Button';
import classes from './Header.module.scss';

const Header = () => {
    const { pdfFile, activeStudy } = useReportDataStore();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [printable, setPrintable] = useState<boolean>(false);
    const { setErrorNotification, showNotifyMsg } = useContext(NotificationContext);
    const {
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
            <Stack
                className={classes.headerInfo}
                direction="column"
                spacing={1}
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                {activeStudy && (
                    <>
                        <Stack direction="row" spacing={2}>
                            <span className={classes.iconText}>
                                <ContactPageIcon /> {activeStudy?.PatientId}
                            </span>
                            <span className={classes.iconText}>
                                <AiOutlineFieldNumber style={{ fontSize: '24px' }} />
                                {activeStudy?.AccessionNumber}
                            </span>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <span className={classes.iconText}>
                                <AccountCircleIcon /> {activeStudy?.PatientsName}
                            </span>
                            <span className={classes.iconText}>
                                <CakeIcon /> {activeStudy?.PatientsBirthDate}
                            </span>
                            <span className={classes.iconText}>
                                <WcIcon />
                                {activeStudy?.PatientsSex}
                            </span>
                        </Stack>
                    </>
                )}
            </Stack>
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
