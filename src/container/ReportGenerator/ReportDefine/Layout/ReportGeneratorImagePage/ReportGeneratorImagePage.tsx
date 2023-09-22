import React, { CSSProperties } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Chip, Menu, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { observer } from 'mobx-react';
import * as R from 'ramda';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
    selectedAttributeAtom,
    selectedAttributePathAtom,
    selectedAttributeTypeAtom,
    selectedDefineType,
    selectedFieldsAtom,
    selectedReportImageDefine,
} from '../../../../../atom/report-generator';
import { usePopupState } from '../../../../../hooks/usePopupState';
import { Field } from '../../../../../interface/report-field/field';
import { fieldGutter, fieldSectionContainer } from '../../../../../styles/report/style';
import { ReportActionContext } from '../../../../Report/Context/reportActionProvider';
import { FormFieldType } from '../../../../Report/FieldComponent/field-type';
import InputFieldContainer from '../../../../Report/Layout/InputFieldContainer/InputFieldContainer';
import { TextFieldAttribute } from '../../Attribute/Field/ReportTextAttribute/TextFieldAttribute';
import { FieldAttributeMapper } from '../../Attribute/report-define-attributes-mapper';
import FieldsetTemplate from '../FieldsetTemplate/FieldsetTemplate';

interface Props {
    fields: Field[];
    showGuideLine: boolean;
}

const ReportGeneratorImagePage = ({ fields, showGuideLine }: Props) => {
    const { anchorEl, open, handleClick, handleClose } = usePopupState();
    const setAttributePath = useSetRecoilState(selectedAttributePathAtom);
    const setSelectedAttribute = useSetRecoilState(selectedAttributeAtom);
    const setSelectedAttributeType = useSetRecoilState(selectedAttributeTypeAtom);
    const setSelectedFields = useSetRecoilState(selectedFieldsAtom);
    const setDefineType = useSetRecoilState(selectedDefineType);
    const setImageDefine = useSetRecoilState(selectedReportImageDefine);
    const selectedFieldList = useRecoilValue(selectedFieldsAtom);

    const onSetAttributePath = (field: Field, idx: number) => {
        const attributeInstance = FieldAttributeMapper[field.type](field);
        setAttributePath([idx]);
        setSelectedAttribute(attributeInstance);
        setSelectedAttributeType(field.type);
        setSelectedFields(new Set<string>().add(JSON.stringify([field.id])));
    };

    const addField = (e) => {
        e.stopPropagation();
        setAttributePath([]);
        setImageDefine((prev) => {
            return R.insert(
                prev.length,
                new TextFieldAttribute({
                    id: `Image_Field_${prev.length}`,
                    label: 'Label',
                    labelWidth: '35%',
                    orientation: 'row',
                    type: FormFieldType.Text,
                }),
                prev,
            );
        });
    };
    const deleteField = (e: Event, idx: number) => {
        e.stopPropagation();
        setAttributePath([]);
        setImageDefine((prev) => R.dissocPath([idx], prev));
    };

    return (
        <fieldset
            style={{ width: '100%', marginTop: '4px' }}
            onClick={() => {
                setDefineType('ImageDefine');
            }}
        >
            <legend>
                <Chip
                    size="small"
                    color="warning"
                    label="Image Page"
                    onDelete={handleClick}
                    deleteIcon={<MoreVertIcon />}
                />
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={addField}>
                        <ListItemIcon>
                            <ContentCopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Add Field</ListItemText>
                    </MenuItem>
                </Menu>
            </legend>
            <Box sx={{ textAlign: 'center' }}>
                <img
                    style={{ textAlign: 'center' }}
                    src="https://picsum.photos/320/180"
                    alt="random"
                />
            </Box>
            {fields.map((field, idx) => {
                return (
                    <FieldsetTemplate
                        key={field.id}
                        id={`formSectionFieldContainer__${field.id}`}
                        style={
                            {
                                ...fieldSectionContainer,
                                flexDirection: field.orientation,
                                padding: fieldGutter,
                            } as CSSProperties
                        }
                        showGuideLine={showGuideLine}
                        isFocus={selectedFieldList.has(JSON.stringify([field.id]))}
                        legendComp={
                            <legend>
                                <Chip
                                    size="small"
                                    color="success"
                                    label={field.id}
                                    onDelete={(e) => deleteField(e, idx)}
                                    deleteIcon={<DeleteIcon />}
                                />
                            </legend>
                        }
                        onClick={(e: Event) => {
                            e.preventDefault();
                            onSetAttributePath(field, idx);
                        }}
                    >
                        <InputFieldContainer
                            key={field.id}
                            field={field}
                            orientation={field.orientation}
                            actionContext={ReportActionContext}
                        />
                    </FieldsetTemplate>
                );
            })}
        </fieldset>
    );
};

export default observer(ReportGeneratorImagePage);
