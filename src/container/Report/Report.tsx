import React, { useContext, useEffect, useState } from 'react';

import { Box, Drawer, Stack } from '@mui/material';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import { filter, tap } from 'rxjs/operators';

import Icon from '../../components/UI/Icon/Icon';
import { NotificationContext } from '../../context/notification-context';
import { useModal } from '../../hooks/useModal';
import { Section } from '../../interface/define';
import { MessageType } from '../../interface/notification';
import ReportSection from '../../layout/ReportSection/ReportSection';
import {
    useOptionStore,
    useReportDataStore,
    useReportDefineStore,
    useReportImageStore,
} from '../../models/useStore';
import { reportPage } from '../../styles/report/style';
import { isEmptyOrNil } from '../../utils/general';
import Photo from '../Photo/Photo';
import ReportEditActionBar from './report-action-bar/ReportEditActionBar/ReportEditActionBar';
import ReportViewActionBar from './report-action-bar/ReportViewActionBar/ReportViewActionBar';
import { ReportActionContext, ReportActionProvider } from './report-context/reportActionProvider';
import classes from './Report.module.scss';

const Report = () => {
    const history = useHistory();
    const { showNotifyMsg, setWarningNotification } = useContext(NotificationContext);
    const { studyInstanceUID } = useParams<any>();
    const { formDefine } = useReportDefineStore();
    const {
        reportHasChanged,
        modifiable,
        fetchReport,
        fetchReportLockStatus,
        formValidation,
        unlockReport,
        cleanupAllReportState,
    } = useReportDataStore();
    const { loading: fetchDefineLoading } = useReportDefineStore();
    const { loading: fetchOptionsLoading } = useOptionStore();
    const { exportDiagramUrl } = useReportImageStore();
    const [photoDrawerOpen, setPhotoDrawerOpen] = useState(false);
    const [setModalName] = useModal();

    const toggleImageDrawer = () => {
        setPhotoDrawerOpen((pre) => {
            // 關閉時記錄Report Diagram
            if (pre) exportDiagramUrl();
            return !pre;
        });
    };

    // open modal when field is in modal
    useEffect(() => {
        if (!formValidation.isValid) setModalName(formValidation.openModalName);
    }, [formValidation, setModalName]);

    useEffect(() => {
        // wait ready
        if (fetchOptionsLoading || fetchDefineLoading) return;

        // check report lock state
        fetchReportLockStatus(studyInstanceUID, (lockSignal$) =>
            lockSignal$.pipe(
                tap(
                    (userId) =>
                        !isEmptyOrNil(userId) &&
                        setWarningNotification(`Report is lock by ${userId}`),
                ),
                filter((userId) => isEmptyOrNil(userId)),
                tap(() =>
                    // fetching report
                    fetchReport(studyInstanceUID, (signal$) =>
                        signal$.pipe(
                            tap(({ notification }) => {
                                showNotifyMsg(notification);
                                if (notification.messageType === MessageType.Error) {
                                    history.push('/');
                                }
                            }),
                        ),
                    ),
                ),
            ),
        );
    }, [
        fetchDefineLoading,
        fetchOptionsLoading,
        fetchReport,
        fetchReportLockStatus,
        history,
        setWarningNotification,
        showNotifyMsg,
        studyInstanceUID,
    ]);

    // clean up all report state and unlock report
    useEffect(() => {
        const unlockReportReq = () => unlockReport(studyInstanceUID);
        window.addEventListener('beforeunload', unlockReportReq);
        return () => {
            window.removeEventListener('beforeunload', unlockReportReq);
            unlockReportReq();
            cleanupAllReportState();
        };
    }, [cleanupAllReportState, studyInstanceUID, unlockReport]);

    return (
        <>
            <Prompt
                when={reportHasChanged && modifiable}
                message="The report was not saved, are you sure to leave?"
            />
            <ReportActionProvider>
                <div className={classes.header}>
                    <Stack direction="row" spacing={2}>
                        {modifiable ? <ReportEditActionBar /> : <ReportViewActionBar />}
                    </Stack>
                </div>
                <div className={classes.reportLayout}>
                    <Box sx={reportPage}>
                        {formDefine.sections
                            .filter((section: Section) => !section.hide)
                            .map((section: Section) => (
                                <ReportSection
                                    key={section.id}
                                    section={section}
                                    actionContext={ReportActionContext}
                                />
                            ))}
                    </Box>
                </div>
            </ReportActionProvider>
            {/* Photo Drawer */}
            <button
                style={{ top: '245px' }}
                className={cx(classes.drawerBtn)}
                type="button"
                onClick={toggleImageDrawer}
            >
                <Icon type="photos" size={40} />
            </button>
            <Drawer
                PaperProps={{ sx: { maxWidth: '90%' } }}
                anchor="left"
                open={photoDrawerOpen}
                onClose={toggleImageDrawer}
            >
                <Photo />
            </Drawer>
        </>
    );
};

export default observer(Report);
