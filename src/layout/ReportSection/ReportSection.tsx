import React from 'react';

import { Box } from '@mui/material';

import { Section, SubSection } from '../../interface/define';
import { reportSection } from '../../styles/report/style';
import ReportSubSection from '../ReportSubSection/ReportSubSection';
import classes from './ReportSection.module.scss';

interface Props {
    section: Section;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportSection = ({ section, actionContext }: Props) => {
    return (
        <>
            {section?.label && (
                <div className={classes[`section-header`]}>
                    <h4 className={classes[`header-label`]}>{section?.label}</h4>
                </div>
            )}
            <Box id={section.id} sx={reportSection} style={{ maxWidth: section.maxWidth }}>
                {section.subSections.map((subSection: SubSection) => (
                    <ReportSubSection
                        key={subSection.id}
                        subSection={subSection}
                        actionContext={actionContext}
                    />
                ))}
            </Box>
        </>
    );
};

export default ReportSection;
