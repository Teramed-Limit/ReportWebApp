import React, { useContext, useEffect, useState } from 'react';

import { Stack } from '@mui/material';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import Icon from '../../components/UI/Icon/Icon';
import { NotificationContext } from '../../context/notification-context';
import { Section } from '../../interface/define';
import { ReportStatus } from '../../interface/document-data';
import { MessageType } from '../../interface/notification';
import ReportSection from '../../layout/ReportSection/ReportSection';
import { useOptionStore, useReportDataStore, useReportDefineStore } from '../../models/useStore';
import Photo from '../Photo/Photo';
import ReportEditActionBar from './report-action-bar/ReportEditActionBar/ReportEditActionBar';
import ReportViewActionBar from './report-action-bar/ReportViewActionBar/ReportViewActionBar';
import { ReportActionContext, ReportActionProvider } from './report-context/reportActionProvider';
import classes from './Report.module.scss';

const Report = () => {
    const history = useHistory();
    const { showNotifyMsg } = useContext(NotificationContext);
    const { studyInstanceUID } = useParams<any>();
    const { formDefine } = useReportDefineStore();
    const { reportStatus, modifiable, fetchReport } = useReportDataStore();
    const { loading: fetchDefineLoading } = useReportDefineStore();
    const { loading: fetchOptionsLoading } = useOptionStore();
    const [photoDrawerOpen, setPhotoDrawerOpen] = useState(false);

    useEffect(() => {
        // wait ready
        if (fetchOptionsLoading || fetchDefineLoading) return;
        fetchReport(studyInstanceUID, (signal$) =>
            signal$.pipe(
                tap(({ notification }) => {
                    showNotifyMsg(notification);
                    if (notification.messageType === MessageType.Error) {
                        history.push('/');
                    }
                }),
            ),
        );
    }, [
        fetchOptionsLoading,
        fetchDefineLoading,
        fetchReport,
        history,
        showNotifyMsg,
        studyInstanceUID,
    ]);

    return (
        <>
            <ReportActionProvider>
                <div className={classes.header}>
                    <Stack direction="row" spacing={2}>
                        {reportStatus === ReportStatus.Signed && !modifiable ? (
                            <ReportViewActionBar />
                        ) : (
                            <ReportEditActionBar />
                        )}
                    </Stack>
                </div>
                <div className={classes.reportLayout}>
                    {formDefine.sections
                        .filter((section: Section) => !section.hide)
                        .map((section: Section) => (
                            <ReportSection
                                key={section.id}
                                section={section}
                                actionContext={ReportActionContext}
                            />
                        ))}
                </div>
            </ReportActionProvider>

            {/* Photo Drawer */}
            <button
                style={{ top: '245px' }}
                className={cx(classes.drawerBtn, { [classes.open]: photoDrawerOpen })}
                type="button"
                onClick={() => setPhotoDrawerOpen(!photoDrawerOpen)}
            >
                <Icon type="photos" size={40} />
            </button>
            <div className={cx(classes.drawer, { [classes.open]: photoDrawerOpen })}>
                <Photo />
            </div>
        </>
    );
};

export default observer(Report);
