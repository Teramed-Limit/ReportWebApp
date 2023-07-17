import React, { CSSProperties } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Chip } from '@mui/material';
import cx from 'classnames';
import * as R from 'ramda';
import { useRecoilState, useSetRecoilState } from 'recoil';

import classes from './ReportGeneratorSection.module.scss';
import {
    selectedAttribute,
    selectedAttributePath,
    selectedAttributeProps,
    selectedReportDefine,
} from '../../../../atom/report-generator';
import { Section, SubSection } from '../../../../interface/define';
import { reportSection } from '../../../../styles/report/style';
import ReportGeneratorSubSection from '../ReportGeneratorSubSection/ReportGeneratorSubSection';

interface Props {
    section: Section;
    path: (string | number)[];
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

class SectionAttribute implements Section {
    id: string;
    hide: boolean;
    label: string;
    type: string;
    maxWidth: string;
    isHeader: boolean;
    subSections: SubSection[];

    constructor(section: Section) {
        this.id = section.id;
        this.hide = section.hide || false;
        this.label = section.label || '';
        this.type = section.type;
        this.maxWidth = section.maxWidth || '';
        this.isHeader = section.isHeader || false;
        this.subSections = section.subSections;
    }
}

const ReportGeneratorSection = ({ section, path, actionContext }: Props) => {
    const [attributePath, setAttributePath] = useRecoilState(selectedAttributePath);
    const setSelectedAttribute = useSetRecoilState(selectedAttribute);
    const setSelectedAttributeProps = useSetRecoilState(selectedAttributeProps);
    const setFormDefine = useSetRecoilState(selectedReportDefine);

    const onSetAttributePath = (e) => {
        e.stopPropagation();
        setAttributePath(path);
        setSelectedAttribute(new SectionAttribute(section));
        setSelectedAttributeProps({
            filterType: 'exclude',
            excludeAttribute: ['subSections', 'type'],
        });
    };

    const onDeleteSection = (e) => {
        e.stopPropagation();
        setAttributePath([]);
        setFormDefine((prev) => R.dissocPath(path, prev));
    };

    return (
        <>
            <fieldset
                id={section.id}
                style={
                    {
                        ...reportSection,
                        maxWidth: section.maxWidth,
                        opacity: section.hide ? 0.4 : 1,
                    } as CSSProperties
                }
                className={cx(classes.fieldset, {
                    [classes.focus]: JSON.stringify(path) === JSON.stringify(attributePath),
                })}
                onClick={onSetAttributePath}
            >
                <legend>
                    <Chip
                        size="small"
                        color="primary"
                        label={section.id}
                        onDelete={onDeleteSection}
                        deleteIcon={<DeleteIcon />}
                    />
                </legend>
                {section?.label && (
                    <div className={classes[`section-header`]}>
                        <h4 className={classes[`header-label`]}>{section?.label}</h4>
                    </div>
                )}
                {section.subSections.map((subSection: SubSection, idx: number) => (
                    <ReportGeneratorSubSection
                        key={subSection.id}
                        path={[...path, 'subSections', idx]}
                        subSection={subSection}
                        actionContext={actionContext}
                    />
                ))}
            </fieldset>
        </>
    );
};

export default React.memo(ReportGeneratorSection);
