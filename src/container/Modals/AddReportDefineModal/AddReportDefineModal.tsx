import React, { useContext, useState } from 'react';

import { Box, TextField } from '@mui/material';

import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';

interface Props {
    onAddReportDefine: (value: string) => void;
}

const AddReportDefineModal = ({ onAddReportDefine }: Props) => {
    const setModal = useContext(ModalContext);

    const [value, setValue] = useState('');

    return (
        <Modal
            open
            width="fit-content"
            height="fit-content"
            headerTitle="Add Report Template"
            body={
                <Box sx={{ p: 2 }}>
                    <TextField
                        label="Report Template"
                        variant="outlined"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </Box>
            }
            footer={
                <>
                    <Button theme="reversePrimary" fontSize={16} onClick={() => setModal(null)}>
                        Cancel
                    </Button>
                    <Button
                        theme="primary"
                        fontSize={16}
                        onClick={() => {
                            onAddReportDefine(value);
                            setModal(null);
                        }}
                    >
                        Add
                    </Button>
                </>
            }
        />
    );
};

export default AddReportDefineModal;
