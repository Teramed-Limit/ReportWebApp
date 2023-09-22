import React, { CSSProperties } from 'react';

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
import { Field } from '../../../../../interface/report-field/field';
import { fieldGutter, fieldSectionContainer } from '../../../../../styles/report/style';
import InputFieldContainer from '../../../../Report/Layout/InputFieldContainer/InputFieldContainer';
import FieldsetTemplate from '../FieldsetTemplate/FieldsetTemplate';

interface Props {
    field: Field;
    path: (string | number)[];
    customValueChange?: (id: string, text: string) => void;
    customValueGetter?: (id: string) => string;
    showGuideLine: boolean;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const ReportGeneratorInputFieldContainer = ({
    field,
    path,
    customValueChange,
    customValueGetter,
    showGuideLine,
    actionContext,
    prefixComp,
    suffixComp,
}: Props) => {
    const selectedFieldList = useRecoilValue(selectedFieldsAtom);
    const { anchorEl, open, handleClick, handleClose } = usePopupState();
    const { onSetAttributePath, onDelete, copyField } = useReportField({
        path,
        field,
    });

    return (
        <FieldsetTemplate
            id={`formSectionFieldContainer__${field.id}`}
            style={
                {
                    ...fieldSectionContainer,
                    flexDirection: field.orientation,
                    padding: fieldGutter,
                } as CSSProperties
            }
            showGuideLine={showGuideLine}
            isFocus={selectedFieldList.has(JSON.stringify(path))}
            legendComp={
                <>
                    <Chip
                        size="small"
                        color="success"
                        label={field.id}
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
            <InputFieldContainer
                key={field.id}
                field={field}
                orientation={field.orientation}
                actionContext={actionContext}
                customValueChange={customValueChange}
                customValueGetter={customValueGetter}
                prefixComp={prefixComp}
                suffixComp={suffixComp}
            />
        </FieldsetTemplate>
    );
};

export default observer(ReportGeneratorInputFieldContainer);
