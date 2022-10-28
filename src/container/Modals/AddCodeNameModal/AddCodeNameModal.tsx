import React, { useCallback, useContext, useState } from 'react';

import { Box, TextField } from '@mui/material';

import { insertCodeListByCodeName } from '../../../axios/api';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';

interface Props {
    initCodeListMap: () => void;
}

const AddCodeNameModal = ({ initCodeListMap }: Props) => {
    const setModal = useContext(ModalContext);

    const [codeName, setCodeName] = useState('');

    const onAddCategory = useCallback(() => {
        insertCodeListByCodeName(codeName).subscribe(() => {
            initCodeListMap();
            setModal(null);
        });
    }, [codeName, initCodeListMap, setModal]);

    return (
        <Modal
            open
            width="fit-content"
            height="fit-content"
            onClose={() => setModal(null)}
            headerTitle="Add Category"
            body={
                <Box sx={{ p: 2 }}>
                    <TextField
                        label="Category"
                        variant="outlined"
                        value={codeName}
                        onChange={(e) => {
                            setCodeName(e.target.value);
                        }}
                    />
                </Box>
            }
            footer={
                <>
                    <Button theme="reversePrimary" fontSize={16} onClick={() => setModal(null)}>
                        Cancel
                    </Button>
                    <Button theme="primary" fontSize={16} onClick={() => onAddCategory()}>
                        Add
                    </Button>
                </>
            }
        />
    );
};

export default AddCodeNameModal;
