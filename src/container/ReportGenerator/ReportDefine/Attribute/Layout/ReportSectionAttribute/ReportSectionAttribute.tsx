import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { Style } from '@react-pdf/types/style';
import * as R from 'ramda';
import { useSetRecoilState } from 'recoil';

import { selectedReportDefine } from '../../../../../../atom/report-generator';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { useReportLayout } from '../../../../../../hooks/useReportLayout';
import { Section, SubSection } from '../../../../../../interface/define';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { CSSStyle } from '../../Common/Complex/ReportCSSStyleAttribute/CSSStyle';
import ReportCSSStyleAttribute from '../../Common/Complex/ReportCSSStyleAttribute/ReportCSSStyleAttribute';
import PercentageNumber from '../../Common/PercentageNumber/PercentageNumber';
import { TextFieldAttribute } from '../../Field/ReportTextAttribute/TextFieldAttribute';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

export class SectionAttribute implements Section {
    id: string;
    hide: boolean;
    hideInPDF: boolean;
    label: string;
    type: string;
    maxWidth: string;
    isHeader: boolean;
    subSections: SubSection[];
    style: Style;

    constructor(section: Section) {
        this.id = section?.id;
        this.hide = section.hide || false;
        this.hideInPDF = section.hideInPDF || false;
        this.label = section.label || '';
        this.type = section.type;
        this.maxWidth = section?.maxWidth || '100%';
        this.isHeader = section.isHeader || false;
        this.subSections = section.subSections || [];
        this.style = section?.style || new CSSStyle();
    }
}

const ReportSectionAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<SectionAttribute>) => {
    const setFormDefine = useSetRecoilState(selectedReportDefine);
    const { moveEntity, copyEntity, deleteEntity } = useReportLayout(attrPath, 'Section');

    const addSubSection = () => {
        setFormDefine((currentFormDefine) => {
            // Get the current subsections from the path
            const currentSection: Section = R.path(attrPath, currentFormDefine) as Section;

            // Create a new subsection
            const newSubSection: SubSection = {
                id: `subSection-${currentSection.subSections.length + 1}`,
                maxWidth: '100%',
                fields: [
                    new TextFieldAttribute({
                        id: `TextField_1`,
                        labelWidth: '35%',
                        type: FormFieldType.Text,
                        orientation: 'row',
                    }),
                ],
            };

            // Append the new subsection to the current subsections
            const updatedSubSections = [...currentSection.subSections, newSubSection];

            // Use assocPath to update the subsections array
            return R.assocPath([...attrPath, 'subSections'], updatedSubSections, currentFormDefine);
        });
    };

    return (
        <>
            <AttributeList
                title={'Section'}
                defaultExpanded={false}
                attribute={attribute}
                setAttribute={onSetAttribute}
                filterType="exclude"
                attributeComponentMapper={{
                    maxWidth: PercentageNumber,
                    style: ReportCSSStyleAttribute,
                }}
                excludeAttribute={['subSections', 'type']}
            />
            <Stack spacing="2px">
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ArrowUpwardIcon />}
                    onClick={() => moveEntity(-1)}
                >
                    Move Forward
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ContentCopyIcon />}
                    onClick={copyEntity}
                >
                    Copy
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={deleteEntity}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    startIcon={<AddIcon />}
                    onClick={addSubSection}
                >
                    Add Sub-Section
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ArrowDownwardIcon />}
                    onClick={() => moveEntity(1)}
                >
                    Move Backward
                </Button>
            </Stack>
        </>
    );
};

export default ReportSectionAttribute;
