import React, { CSSProperties } from 'react';

import { Box, Chip } from '@mui/material';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
    selectedAttributeAtom,
    selectedAttributePathAtom,
    selectedAttributeTypeAtom,
    selectedDefineType,
    selectedFieldsAtom,
} from '../../../../../atom/report-generator';
import { SubSection } from '../../../../../interface/define';
import { ArrayField } from '../../../../../interface/report-field/array-field';
import { CompositeField } from '../../../../../interface/report-field/composite-field';
import { reportSubsection } from '../../../../../styles/report/style';
import { FormFieldType, LayoutType } from '../../../../Report/FieldComponent/field-type';
import { SubSectionAttribute } from '../../Attribute/Layout/ReportSubSectionAttribute/ReportSubSectionAttribute';
import FieldsetTemplate from '../FieldsetTemplate/FieldsetTemplate';
import ReportGeneratorFormSectionArrayField from '../ReportGeneratorInputArrayField/ReportGeneratorInputArrayField';
import ReportGeneratorFormSectionCompositeField from '../ReportGeneratorInputCompositeField/ReportGeneratorInputCompositeField';
import ReportGeneratorFormSectionFieldContainer from '../ReportGeneratorInputFieldContainer/ReportGeneratorInputFieldContainer';

interface Props {
    subSection: SubSection;
    showGuideLine: boolean;
    path: (string | number)[];
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportGeneratorSubSection = ({ subSection, path, showGuideLine, actionContext }: Props) => {
    const setAttributePath = useSetRecoilState(selectedAttributePathAtom);
    const setSelectedAttribute = useSetRecoilState(selectedAttributeAtom);
    const setSelectedAttributeType = useSetRecoilState(selectedAttributeTypeAtom);
    const setSelectedFields = useSetRecoilState(selectedFieldsAtom);
    const setDefineType = useSetRecoilState(selectedDefineType);
    const selectedFieldList = useRecoilValue(selectedFieldsAtom);

    const onSetAttributePath = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDefineType('FormDefine');
        setAttributePath(path);
        setSelectedAttribute(new SubSectionAttribute(subSection));
        setSelectedAttributeType(LayoutType.SubSection);
        setSelectedFields(new Set<string>().add(JSON.stringify(path)));
    };

    return (
        <FieldsetTemplate
            id={subSection.id}
            style={{
                ...reportSubsection,
                maxWidth: subSection?.maxWidth,
                width: subSection?.maxWidth,
            }}
            showGuideLine={showGuideLine}
            isFocus={selectedFieldList.has(JSON.stringify(path))}
            legendComp={<Chip size="small" color="secondary" label={subSection.id} />}
            onClick={onSetAttributePath}
        >
            <Box
                style={
                    {
                        ...reportSubsection,
                        ...((subSection?.style || {}) as CSSProperties),
                    } as CSSProperties
                }
            >
                {subSection.fields.map((field, idx) => {
                    switch (field.type) {
                        case FormFieldType.Composite:
                            return (
                                <ReportGeneratorFormSectionCompositeField
                                    path={[...path, 'fields', idx]}
                                    showGuideLine={showGuideLine}
                                    key={field.id}
                                    field={field as CompositeField}
                                    actionContext={actionContext}
                                />
                            );
                        case FormFieldType.Array:
                            return (
                                <ReportGeneratorFormSectionArrayField
                                    key={field.id}
                                    showGuideLine={showGuideLine}
                                    path={[...path, 'fields', idx]}
                                    field={field as ArrayField}
                                    actionContext={actionContext}
                                />
                            );
                        default:
                            return (
                                <ReportGeneratorFormSectionFieldContainer
                                    key={field.id}
                                    showGuideLine={showGuideLine}
                                    path={[...path, 'fields', idx]}
                                    field={field}
                                    actionContext={actionContext}
                                />
                            );
                    }
                })}
            </Box>
        </FieldsetTemplate>
    );
};

export default ReportGeneratorSubSection;
