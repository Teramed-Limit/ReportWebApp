import React, { useCallback, useContext, useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import CakeIcon from '@mui/icons-material/Cake';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import WcIcon from '@mui/icons-material/Wc';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react';
import { AiOutlineFieldNumber } from 'react-icons/all';
import { useHistory } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import { NotificationContext } from '../../context/notification-context';
import { useAuthStore, useReportDataStore } from '../../models/useStore';
import { generateUUID } from '../../utils/general';
import ButtonGroup from '../UI/Button-Group/Button-Group';
import Button from '../UI/Button/Button';
import classes from './Header.module.scss';
import NavigationItem from '../Navigation/NavigationItem/NavigationItem';

const Header = () => {
    const history = useHistory();
    const { onLogout } = useAuthStore();
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

    const logout = () => {
        onLogout(null, (signal$) => signal$.pipe(tap(() => history.push({ pathname: `/login` }))));
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
                    <NavigationItem link="/">
                        <Button id="btn__home" color="black">
                            <HomeRoundedIcon className={classes.iconButton} />
                            Home
                        </Button>
                    </NavigationItem>
                    <NavigationItem link="/setting">
                        <Button id="btn__setting" color="black">
                            <SettingsIcon className={classes.iconButton} />
                            Settings
                        </Button>
                    </NavigationItem>
                    <NavigationItem link="/account">
                        <Button id="btn__account" color="black">
                            <AccountCircleSharpIcon className={classes.iconButton} />
                            Account
                        </Button>
                    </NavigationItem>
                    <NavigationItem link="/account">
                        <Button id="btn__logout" color="black" onClick={logout}>
                            <LogoutRoundedIcon className={classes.iconButton} />
                            Logout
                        </Button>
                    </NavigationItem>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default observer(Header);
