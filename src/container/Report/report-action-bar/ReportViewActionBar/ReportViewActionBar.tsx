import React, { CSSProperties, useContext } from 'react';

import { Button as MaterialButton, Link } from '@mui/material';
import { observer } from 'mobx-react';
import { filter, tap } from 'rxjs/operators';

import classes from './ReportViewActionBar.module.scss';
import Modal from '../../../../components/Modal/Modal';
import PdfCreator from '../../../../components/PdfCreator/PdfCreator';
import Button from '../../../../components/UI/Button/Button';
import { ModalContext } from '../../../../context/modal-context';
import { NotificationContext } from '../../../../context/notification-context';
import { useReportDataStore } from '../../../../models/useStore';
import ConfigService from '../../../../service/config-service';
import { isEmptyOrNil } from '../../../../utils/general';
import MessageModal from '../../../Modals/MessageModal/MessageModal';

const ReportViewActionBar: React.FC = () => {
    const { fetchReportLockStatus, lockReport, studyInsUID, lockByUser } = useReportDataStore();
    const { setWarningNotification } = useContext(NotificationContext);
    const setModal = useContext(ModalContext);

    const modifyReport = () => {
        fetchReportLockStatus(studyInsUID, (lockSignal$) =>
            lockSignal$.pipe(
                tap(
                    (userId) =>
                        !isEmptyOrNil(userId) &&
                        setWarningNotification(`Report is lock by ${userId}`),
                ),
                filter((userId) => isEmptyOrNil(userId)),
                tap(() => lockReport(studyInsUID)),
            ),
        );
    };

    const onEdit = () => {
        setModal(
            <MessageModal
                headerTitle="Message"
                bodyContent="If you edit the report again, you must re-signOff the report."
                onConfirmCallback={() => modifyReport()}
            />,
        );
    };

    return (
        <>
            <Button
                disabled={!!lockByUser}
                theme="primary"
                icon="save"
                iconPosition="left"
                fontSize={16}
                onClick={() => onEdit()}
            >
                Edit
            </Button>
            <Button
                disabled={!!lockByUser}
                theme="primary"
                icon="print"
                iconPosition="left"
                fontSize={16}
                onClick={() => {
                    setModal(
                        <Modal
                            open
                            width="80%"
                            height="80%"
                            overflow="hidden hidden"
                            headerTitle="PDF Preview"
                            body={<PdfCreator showToolbar />}
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
                                    <MaterialButton
                                        size="large"
                                        variant="contained"
                                        component={Link}
                                        download
                                        href={`${ConfigService.getIpAddress()}/api/report/studyInstanceUID/${studyInsUID}/downloadPDF`}
                                    >
                                        Download
                                    </MaterialButton>
                                </>
                            }
                        />,
                    );
                }}
            >
                Print
            </Button>
            {lockByUser && <div className={classes.blinkText}>{lockByUser} is editing report</div>}
        </>
    );
};

export default observer(ReportViewActionBar);
