import React, { CSSProperties } from 'react';

import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import classes from './ReportGeneratorSection.module.scss';
import {
    selectedAttributeAtom,
    selectedAttributePathAtom,
    selectedAttributeTypeAtom,
    selectedDefineType,
    selectedFieldsAtom,
} from '../../../../../atom/report-generator';
import { Section, SubSection } from '../../../../../interface/define';
import { reportSection } from '../../../../../styles/report/style';
import { LayoutType } from '../../../../Report/FieldComponent/field-type';
import { SectionAttribute } from '../../Attribute/Layout/ReportSectionAttribute/ReportSectionAttribute';
import FieldsetTemplate from '../FieldsetTemplate/FieldsetTemplate';
import ReportGeneratorSubSection from '../ReportGeneratorSubSection/ReportGeneratorSubSection';

interface Props {
    section: Section;
    path: (string | number)[];
    showGuideLine: boolean;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportGeneratorSection = ({ section, path, showGuideLine, actionContext }: Props) => {
    const setAttributePath = useSetRecoilState(selectedAttributePathAtom);
    const setSelectedAttribute = useSetRecoilState(selectedAttributeAtom);
    const setSelectedAttributeType = useSetRecoilState(selectedAttributeTypeAtom);
    const setSelectedFields = useSetRecoilState(selectedFieldsAtom);
    const setDefineType = useSetRecoilState(selectedDefineType);
    const selectedFieldList = useRecoilValue(selectedFieldsAtom);

    const onSetAttributePath = (e) => {
        e.stopPropagation();
        setDefineType('FormDefine');
        setAttributePath(path);
        setSelectedAttribute(new SectionAttribute(section));
        setSelectedAttributeType(LayoutType.Section);
        setSelectedFields(new Set<string>().add(JSON.stringify(path)));
    };

    return (
        <FieldsetTemplate
            id={section.id}
            style={
                {
                    ...reportSection,
                    maxWidth: section.maxWidth,
                    width: section.maxWidth,
                    opacity: section.hide ? 0.4 : 1,
                } as CSSProperties
            }
            showGuideLine={showGuideLine}
            isFocus={selectedFieldList.has(JSON.stringify(path))}
            legendComp={<Chip size="small" color="primary" label={section.id} />}
            onClick={onSetAttributePath}
        >
            <Box
                style={
                    {
                        ...reportSection,
                        ...((section?.style || {}) as CSSProperties),
                    } as CSSProperties
                }
            >
                {section?.label && (
                    <div className={classes[`section-header`]}>
                        <h4 className={classes[`header-label`]}>{section?.label}</h4>
                    </div>
                )}
                {section.subSections.map((subSection: SubSection, idx: number) => (
                    <ReportGeneratorSubSection
                        key={subSection.id}
                        showGuideLine={showGuideLine}
                        path={[...path, 'subSections', idx]}
                        subSection={subSection}
                        actionContext={actionContext}
                    />
                ))}
            </Box>
        </FieldsetTemplate>
    );
};

export default React.memo(ReportGeneratorSection);
