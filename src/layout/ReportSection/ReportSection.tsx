import React from 'react';

import { Section, SubSection } from '../../interface/define';
import ReportSubSection from '../ReportSubSection/ReportSubSection';
import classes from './ReportSection.module.scss';

interface Props {
    section: Section;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportSection = ({ section, actionContext }: Props) => {
    return (
        <>
            {section?.label ? (
                <div className={classes[`section-header`]}>
                    <h4 className={classes[`header-label`]}>{section?.label}</h4>
                </div>
            ) : null}
            <div
                id={section.id}
                style={{ maxWidth: section.maxWidth }}
                className={classes[`section-wrapper`]}
            >
                {section.subSections.map((subSection: SubSection, subSectionIdx: number) => (
                    <ReportSubSection
                        key={subSection.id}
                        subSection={subSection}
                        ratio={section.ratio[subSectionIdx]}
                        actionContext={actionContext}
                    />
                ))}
            </div>
        </>
    );
};

export default ReportSection;
