import React from 'react';

import { observer } from 'mobx-react';

import { Section } from '../../interface/define';
import ReportSection from '../../layout/ReportSection/ReportSection';
import { useReportDefineStore } from '../../models/useStore';
import { ReportActionContext, ReportActionProvider } from './report-context/reportActionProvider';
import classes from './Report.module.scss';

const Report = () => {
    const { formDefine } = useReportDefineStore();

    return (
        <ReportActionProvider>
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
    );
};

export default observer(Report);
