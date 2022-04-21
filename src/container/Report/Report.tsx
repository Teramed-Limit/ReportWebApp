import React, { useEffect, useState } from 'react';

import { Drawer, Stack } from '@mui/material';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Icon from '../../components/UI/Icon/Icon';
import { Section } from '../../interface/define';
import { ReportStatus } from '../../interface/document-data';
import ReportSection from '../../layout/ReportSection/ReportSection';
import { useReportDataStore, useReportDefineStore } from '../../models/useStore';
import Photo from '../Photo/Photo';
import ReportEditActionBar from './report-action-bar/ReportEditActionBar/ReportEditActionBar';
import ReportViewActionBar from './report-action-bar/ReportViewActionBar/ReportViewActionBar';
import { ReportActionContext, ReportActionProvider } from './report-context/reportActionProvider';
import classes from './Report.module.scss';

const Report = () => {
    const history = useHistory();
    const { formDefine } = useReportDefineStore();
    const { activeStudy, reportStatus, modifiable } = useReportDataStore();
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (!activeStudy) history.push('/');
    }, [activeStudy, history]);

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
                <button
                    className={cx(classes.toggleDrawer, {
                        [classes.open]: drawerOpen,
                    })}
                    type="button"
                    onClick={() => setDrawerOpen(!drawerOpen)}
                >
                    <Icon type="photos" size={40} />
                </button>
                <div className={classes.reportTimeline}>
                    Created by test elli, Last Modified by Ian Tai on 28/Jan/2021
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
                <Drawer
                    PaperProps={{ sx: { maxWidth: '80%', width: '80%' } }}
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <Photo />
                </Drawer>
            </ReportActionProvider>
        </>
    );
};

export default observer(Report);
