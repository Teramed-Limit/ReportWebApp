import React, { useContext, useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, IconButton } from '@mui/material';

import classes from './ConditionQuerier.module.scss';
import { ModalContext } from '../../context/modal-context';
import { FormField, FormFieldEditorType } from '../../interface/form-editor-define';
import { TransferItem } from '../../interface/transfer-item';
import { EditorDefaultValue, EditorMapper } from '../../layout/FormEditor/Editor/editorMapper';
import Modal from '../Modal/Modal';
import TransferList from '../TransferList/TransferList';

interface Props {
    fields: FormField[];
    defaultQueryFields: string[];
    queryPairData: any;
    onQuery: () => void;
    onQueryPairDataChanged: (value: any, fieldId: string) => void;
}

const ConditionQuerier = ({
    fields,
    queryPairData,
    defaultQueryFields,
    onQuery,
    onQueryPairDataChanged,
}: Props) => {
    const setModal = useContext(ModalContext);

    const [transferItems] = useState<TransferItem[]>(
        fields.map((item) => ({ id: item.id, label: item.label ?? '', disabled: false })),
    );

    const [selectedTransferItems, setSelectedTransferItems] = useState<TransferItem[]>(
        transferItems.filter((item) => defaultQueryFields.includes(item.id)),
    );

    const [queryFields, setQueryFields] = useState(
        fields.filter((item) => defaultQueryFields.includes(item.id)),
    );

    const onValueChanged = (value: any, fieldId: string) => {
        onQueryPairDataChanged(value, fieldId);
    };

    const onQueryConditionChanged = (
        selectedList: TransferItem[],
        unselectedList: TransferItem[],
    ) => {
        // reset query pair data
        unselectedList.forEach((item) => onQueryPairDataChanged('', item.id));
        // update query field
        const fieldIdList = selectedList.map((item) => item.id);
        setSelectedTransferItems(selectedList);
        setQueryFields(fields.filter((field) => fieldIdList.includes(field.id)));
        setModal(null);
    };

    const openModal = () => {
        setModal(
            <Modal
                open
                width="auto"
                height="auto"
                headerTitle="Custom Condition"
                body={
                    <TransferList
                        itemList={transferItems}
                        selectItemList={selectedTransferItems}
                        onTransferListChanged={onQueryConditionChanged}
                        onCancel={() => setModal(null)}
                    />
                }
                footer={<></>}
            />,
        );
    };

    return (
        <div className={classes.queryCondition}>
            <IconButton component="span" size="small" onClick={() => openModal()}>
                <SettingsIcon />
            </IconButton>
            {queryFields.map((field) => {
                const RenderComponent = EditorMapper[field.type];
                const value = queryPairData[field.id] || EditorDefaultValue[field.type];

                return (
                    <Box
                        key={field.id}
                        sx={{ flex: field.type === FormFieldEditorType.DataRange ? 2 : 1 }}
                    >
                        <RenderComponent
                            field={field}
                            value={value}
                            isValid
                            onValueChanged={onValueChanged}
                        />
                    </Box>
                );
            })}
            <Button variant="contained" color="primary" onClick={onQuery}>
                Query
            </Button>
        </div>
    );
};

export default ConditionQuerier;
