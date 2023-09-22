import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import * as R from 'ramda';
import { useSetRecoilState } from 'recoil';

import { selectedReportDefine } from '../../../../../../atom/report-generator';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { FormDefine, Section } from '../../../../../../interface/define';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { TextFieldAttribute } from '../../Field/ReportTextAttribute/TextFieldAttribute';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportPageAttribute = ({ onSetAttribute }: RenderComponentAttributeProps<FormDefine>) => {
    const setFormDefine = useSetRecoilState(selectedReportDefine);

    const addSection = () => {
        setFormDefine((currentFormDefine) => {
            // Create a new subsection
            const newSection: Section = {
                type: 'form',
                id: `section-${(currentFormDefine?.sections?.length || 0) + 1}`,
                maxWidth: '100%',
                hideInPDF: false,
                subSections: [
                    {
                        id: `subSection-1`,
                        maxWidth: '100%',
                        fields: [
                            new TextFieldAttribute({
                                id: `TextField_1`,
                                labelWidth: '35%',
                                type: FormFieldType.Text,
                                orientation: 'row',
                            }),
                        ],
                    },
                ],
            };

            // Append the new subsection to the current subsections
            const updated = [...(currentFormDefine.sections || []), newSection];

            // Use assocPath to update the subsections array
            return R.assocPath(['sections'], updated, currentFormDefine);
        });
    };

    return (
        <>
            <AttributeList title="Page" attribute={{}} setAttribute={onSetAttribute} />
            <Button
                variant="contained"
                color="warning"
                startIcon={<AddIcon />}
                onClick={addSection}
            >
                Add Section
            </Button>
        </>
    );
};

export default ReportPageAttribute;
