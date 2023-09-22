import React from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Chip, Menu, MenuItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { observer } from 'mobx-react';
import { useRecoilValue } from 'recoil';

import { selectedFieldsAtom } from '../../../../../atom/report-generator';
import { usePopupState } from '../../../../../hooks/usePopupState';
import { useReportField } from '../../../../../hooks/useReportField';
import { ArrayField } from '../../../../../interface/report-field/array-field';
import { fieldArrayContainer, fieldGutter } from '../../../../../styles/report/style';
import FormSectionArrayField from '../../../../Report/Layout/InputArrayField/InputArrayField';
import FieldsetTemplate from '../FieldsetTemplate/FieldsetTemplate';

interface Props {
    field: ArrayField;
    path: (string | number)[];
    showGuideLine: boolean;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportGeneratorInputArrayField = ({
    field: arrayField,
    path,
    showGuideLine,
    actionContext,
}: Props) => {
    const selectedFieldList = useRecoilValue(selectedFieldsAtom);
    const { anchorEl, open, handleClick, handleClose } = usePopupState();
    const { onSetAttributePath, onDelete, copyField } = useReportField({
        path,
        field: arrayField,
    });

    return (
        <FieldsetTemplate
            id={`fieldArrayContainer__${arrayField.id}`}
            style={{
                ...fieldArrayContainer,
                flexDirection: arrayField.orientation,
                padding: fieldGutter,
            }}
            showGuideLine={showGuideLine}
            isFocus={selectedFieldList.has(JSON.stringify(path))}
            legendComp={
                <>
                    <Chip
                        size="small"
                        color="success"
                        label={arrayField.id}
                        onDelete={handleClick}
                        deleteIcon={<MoreVertIcon />}
                    />
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MenuItem onClick={copyField}>
                            <ListItemIcon>
                                <ContentCopyIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Copy Field</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={onDelete}>
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    </Menu>
                </>
            }
            onClick={onSetAttributePath}
        >
            <FormSectionArrayField
                key={arrayField.id}
                field={arrayField}
                actionContext={actionContext}
            />
        </FieldsetTemplate>
    );
};

export default observer(ReportGeneratorInputArrayField);
