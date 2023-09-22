import React, { useContext, useEffect, useState } from 'react';

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Box, Button, Drawer, Stack } from '@mui/material';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import classes from './ReportHistory.module.scss';
import ReportTimeline from './ReportTimeline/ReportTimeline';
import { fetchReportTimeline } from '../../axios/api';
import { NotificationContext } from '../../context/notification-context';
import { Section } from '../../interface/define';
import { MessageType } from '../../interface/notification';
import { ReportStatusTimeline } from '../../interface/report-timeline';
import { useOptionStore, useReportDataStore, useReportDefineStore } from '../../models/useStore';
import { reportPage } from '../../styles/report/style';
import { convertToDateTime } from '../../utils/general';
import Photo from '../Photo/Photo';
import ReportHistoryActionBar from '../Report/ActionBar/ReportHistoryActionBar/ReportHistoryActionBar';
import { ReportActionContext, ReportActionProvider } from '../Report/Context/reportActionProvider';
import ReportSection from '../Report/Layout/ReportSection/ReportSection';

const ReportHistory = () => {
    const history = useHistory();
    const { showNotifyMsg } = useContext(NotificationContext);
    const { studyInstanceUID, version } = useParams<any>();
    const { formDefine, fetchHistoryDefine } = useReportDefineStore();
    const { loading: fetchDataLoading, fetchHistoryReport, formData } = useReportDataStore();
    const { loading: fetchDefineLoading } = useReportDefineStore();
    const { loading: fetchOptionsLoading } = useOptionStore();
    const [photoDrawerOpen, setPhotoDrawerOpen] = useState(false);
    const [timelineDrawerOpen, setTimelineDrawerOpen] = useState(false);
    const [reportStatusTimeline, setReportStatusTimelines] = useState<ReportStatusTimeline[]>([]);
    const [maxVersion, setMaxVersion] = useState(0);
    const [minVersion, setMinVersion] = useState(0);

    const toggleTimelineDrawer = () => {
        setTimelineDrawerOpen((pre) => !pre);
    };

    const toggleImageDrawer = () => {
        setPhotoDrawerOpen((pre) => !pre);
    };

    // fetch history report
    useEffect(() => {
        fetchHistoryReport({ studyInstanceUID, version }, (signal$) =>
            signal$.pipe(
                tap(({ notification }) => {
                    showNotifyMsg(notification);
                    if (notification.messageType === MessageType.Error) {
                        history.push('/history');
                    }
                }),
            ),
        );
    }, [fetchHistoryReport, history, showNotifyMsg, studyInstanceUID, version]);

    // fetch history define
    useEffect(() => {
        fetchHistoryDefine({ studyInstanceUID, version }, (signal$) =>
            signal$.pipe(
                tap(({ notification }) => {
                    showNotifyMsg(notification);
                    if (notification.messageType === MessageType.Error) {
                        history.push('/history');
                    }
                }),
            ),
        );
    }, [fetchHistoryDefine, history, showNotifyMsg, studyInstanceUID, version]);

    // fetch report timeline
    useEffect(() => {
        fetchReportTimeline(studyInstanceUID).subscribe((res) => {
            setReportStatusTimelines(res.data.Timelines);
            setMaxVersion(res.data.MaxVersion);
            setMinVersion(res.data.MinVersion);
        });
    }, [studyInstanceUID, version]);

    return (
        <>
            <ReportActionProvider>
                <div className={classes.header}>
                    <Stack direction="row" spacing={2}>
                        <ReportHistoryActionBar />
                    </Stack>
                </div>
                <Box className={classes.reportStatusBar}>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SkipPreviousIcon />}
                            disabled={minVersion === +version}
                            onClick={() => {
                                history.push({
                                    pathname: `/reporting/history/studyInstanceUID/${studyInstanceUID}/version/${
                                        +version - 1
                                    }`,
                                });
                            }}
                        >
                            Previous Version
                        </Button>
                    </div>
                    <div>
                        Created by&nbsp;
                        <span className={classes.highlight}>{formData.get('Author')}</span>
                        &nbsp;on&nbsp;
                        <span className={classes.highlight}>
                            {formData.get('DateTime') &&
                                convertToDateTime(formData.get('DateTime'))}
                        </span>
                        &nbsp;Version&nbsp;
                        <span className={classes.highlight}>{formData.get('Version')}</span>
                    </div>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SkipNextIcon />}
                            disabled={maxVersion === +version}
                            onClick={() => {
                                history.push({
                                    pathname: `/reporting/history/studyInstanceUID/${studyInstanceUID}/version/${
                                        +version + 1
                                    }`,
                                });
                            }}
                        >
                            Next Version
                        </Button>
                    </div>
                </Box>
                {!fetchDefineLoading && !fetchOptionsLoading && !fetchDataLoading && (
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
                )}
            </ReportActionProvider>

            {/* Photo Drawer */}
            <button
                style={{ top: '245px' }}
                className={cx(classes.drawerBtn)}
                type="button"
                onClick={toggleImageDrawer}
            >
                <PhotoCameraIcon fontSize="large" />
            </button>
            <Drawer
                PaperProps={{ sx: { maxWidth: '90%' } }}
                ModalProps={{ keepMounted: true }}
                anchor="left"
                open={photoDrawerOpen}
                onClose={toggleImageDrawer}
                disableEnforceFocus
            >
                <Photo />
            </Drawer>
            {/* Timeline Drawer */}
            <button
                style={{ top: '325px' }}
                className={cx(classes.drawerBtn)}
                type="button"
                onClick={toggleTimelineDrawer}
            >
                <TimelineIcon fontSize="large" />
            </button>
            <Drawer anchor="left" open={timelineDrawerOpen} onClose={toggleTimelineDrawer}>
                <ReportTimeline reportTimeline={reportStatusTimeline} />
            </Drawer>
        </>
    );
};

export default observer(ReportHistory);
