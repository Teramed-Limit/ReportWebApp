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
import { CompositeField } from '../../../../../interface/report-field/composite-field';
import { fieldGutter, fieldSectionContainer } from '../../../../../styles/report/style';
import { ReportGeneratorFieldMapper } from '../../../../Report/FieldComponent/field-mapper';
import InputCompositeField from '../../../../Report/Layout/InputCompositeField/InputCompositeField';
import FieldsetTemplate from '../FieldsetTemplate/FieldsetTemplate';

interface Props {
    path: (string | number)[];
    field: CompositeField;
    customValueChange?: (id: string, text: string) => void;
    customValueGetter?: (id: string) => string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
    showGuideLine: boolean;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const ReportGeneratorInputCompositeField = ({
    path,
    field: compositeField,
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
        field: compositeField,
    });

    return (
        <FieldsetTemplate
            id={`formSectionCompositeContainer__${compositeField.id}`}
            style={
                {
                    ...fieldSectionContainer,
                    flexDirection: compositeField.orientation,
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
                        label={compositeField.id}
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
            <InputCompositeField
                key={compositeField.id}
                orientation={compositeField.orientation}
                field={compositeField}
                fieldMapper={ReportGeneratorFieldMapper}
                actionContext={actionContext}
                customValueChange={customValueChange}
                customValueGetter={customValueGetter}
                prefixComp={prefixComp}
                suffixComp={suffixComp}
            />
        </FieldsetTemplate>
    );
};

export default observer(ReportGeneratorInputCompositeField);
