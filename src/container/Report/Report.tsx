import React, { useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack } from '@mui/material';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Icon from '../../components/UI/Icon/Icon';
import { Section } from '../../interface/define';
import { ReportStatus } from '../../interface/document-data';
import ReportSection from '../../layout/ReportSection/ReportSection';
import { useReportDataStore, useReportDefineStore } from '../../models/useStore';
import { dataFormatString, isEmptyOrNil } from '../../utils/general';
import Photo from '../Photo/Photo';
import ReportEditActionBar from './report-action-bar/ReportEditActionBar/ReportEditActionBar';
import ReportViewActionBar from './report-action-bar/ReportViewActionBar/ReportViewActionBar';
import { ReportActionContext, ReportActionProvider } from './report-context/reportActionProvider';
import classes from './Report.module.scss';

const Report = () => {
    const history = useHistory();
    const { formDefine } = useReportDefineStore();
    const { activeStudy, reportStatus, modifiable, formData } = useReportDataStore();
    const [photoDrawerOpen, setPhotoDrawerOpen] = useState(false);

    useEffect(() => {
        if (isEmptyOrNil(activeStudy)) history.push('/');
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
                <div className={classes.patientInfo}>
                    <AccountCircleIcon sx={{ fontSize: '36px' }} />
                    <div className={classes.content}>
                        <span>
                            {activeStudy.PatientsName} ({activeStudy.PatientId})
                        </span>
                        <div className={classes.contentBetween}>
                            <div>{activeStudy.AccessionNumber}</div>
                            <div>
                                {formData.get('CreateUser') && (
                                    <>
                                        <span>Created by </span>
                                        <span className={classes.highlight}>
                                            {formData.get('CreateUser')}
                                        </span>
                                    </>
                                )}
                                {formData.get('ModifiedUser') && (
                                    <>
                                        <span>, Last Modified by </span>
                                        <span className={classes.highlight}>
                                            {formData.get('ModifiedUser')}
                                        </span>
                                    </>
                                )}
                                {formData.get('ModifiedDateTime') && (
                                    <>
                                        <span> on </span>
                                        <span className={classes.highlight}>
                                            {dataFormatString(
                                                formData.get('ModifiedDateTime'),
                                                'yyyyMMddHHmmss',
                                                'dd-MMM-yyyy',
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
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
