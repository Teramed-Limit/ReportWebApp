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
import { SubSection } from '../../../../../../interface/define';
import { Field } from '../../../../../../interface/report-field/field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { CSSStyle } from '../../Common/Complex/ReportCSSStyleAttribute/CSSStyle';
import ReportCSSStyleAttribute from '../../Common/Complex/ReportCSSStyleAttribute/ReportCSSStyleAttribute';
import PercentageNumber from '../../Common/PercentageNumber/PercentageNumber';
import { TextFieldAttribute } from '../../Field/ReportTextAttribute/TextFieldAttribute';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

export class SubSectionAttribute implements SubSection {
    id: string;
    maxWidth?: string;
    fields: Field[];
    style: Style;

    constructor(subSection: SubSection) {
        this.id = subSection.id;
        this.maxWidth = subSection.maxWidth || '';
        this.fields = subSection.fields || [];
        this.style = subSection?.style || new CSSStyle();
    }
}

const ReportSubSectionAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<SubSectionAttribute>) => {
    const { moveEntity, copyEntity, deleteEntity } = useReportLayout(attrPath, 'SubSection');
    const setFormDefine = useSetRecoilState(selectedReportDefine);

    const addField = () => {
        setFormDefine((currentFormDefine) => {
            // Create a path to the 'fields' of the targeted SubSection
            const fieldsPath = [...attrPath, 'fields'];

            // Get the current fields using the generated path
            const currentFields = R.path<Field[]>(fieldsPath, currentFormDefine) || [];

            // Create a new TextFieldAttribute
            const field = new TextFieldAttribute({
                id: `TextField_${currentFields.length + 1}`,
                labelWidth: '35%',
                type: FormFieldType.Text,
                orientation: 'row',
            });

            // Use assocPath to set the updated fields
            return R.assocPath(fieldsPath, [...currentFields, field], currentFormDefine);
        });
    };

    return (
        <>
            <AttributeList
                title={'SubSection'}
                attribute={attribute}
                defaultExpanded={false}
                setAttribute={onSetAttribute}
                filterType="exclude"
                attributeComponentMapper={{
                    maxWidth: PercentageNumber,
                    style: ReportCSSStyleAttribute,
                }}
                excludeAttribute={['fields']}
            />
            <Stack sx={{ position: 'sticky', bottom: 0 }} spacing="2px">
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
                    onClick={addField}
                >
                    Add Field
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

export default ReportSubSectionAttribute;
