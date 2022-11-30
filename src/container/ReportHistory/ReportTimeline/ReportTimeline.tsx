import * as React from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Chip, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import { OverridableStringUnion } from '@mui/types';
import { useHistory, useParams } from 'react-router-dom';

import { ReportStatus } from '../../../interface/document-data';
import { ReportStatusTimeline } from '../../../interface/report-timeline';
import { convertToDateTime } from '../../../utils/general';
import classes from './ReportTimeline.module.scss';

interface Props {
    reportTimeline: ReportStatusTimeline[];
}

const ReportTimeline = ({ reportTimeline }: Props) => {
    const history = useHistory();
    const { studyInstanceUID } = useParams<any>();

    const chipComp = (value: ReportStatus) => {
        let color: OverridableStringUnion<
            'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
        >;

        switch (value) {
            case ReportStatus.InComplete:
                color = 'primary';
                break;
            case ReportStatus.Saved:
                color = 'warning';
                break;
            case ReportStatus.Signed:
                color = 'success';
                break;
            default:
                color = 'default';
        }

        return (
            <Chip
                sx={{ fontSize: '12px', height: '20px', fontWeight: 700 }}
                color={color}
                label={value}
            />
        );
    };

    const onNavigateToSelectedVersion = (version: number) => {
        history.push({
            pathname: `/reporting/history/studyInstanceUID/${studyInstanceUID}/version/${version}`,
        });
    };

    return (
        <>
            <div className={classes.rowContainer}>
                <Typography sx={{ p: 1 }} align="center" variant="h4" component="div">
                    Timeline
                </Typography>
                <div className={classes.timelineContainer}>
                    <Timeline position="right" onResize onResizeCapture>
                        {reportTimeline.map((operationRecord) => {
                            return (
                                <TimelineItem key={operationRecord.Version.toString()}>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0', flex: 'none' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        <div>{convertToDateTime(operationRecord.DateTime)}</div>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Typography
                                            sx={{ color: '#ffb860' }}
                                            variant="h6"
                                            component="div"
                                        >
                                            {operationRecord.Author}
                                        </Typography>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <Link
                                            underline="always"
                                            component="button"
                                            variant="body1"
                                            onClick={() =>
                                                onNavigateToSelectedVersion(operationRecord.Version)
                                            }
                                        >
                                            Version {operationRecord.Version}
                                        </Link>
                                        {chipComp(operationRecord.ReportStatus)}
                                    </TimelineContent>
                                </TimelineItem>
                            );
                        })}
                    </Timeline>
                </div>
            </div>
        </>
    );
};

export default ReportTimeline;
