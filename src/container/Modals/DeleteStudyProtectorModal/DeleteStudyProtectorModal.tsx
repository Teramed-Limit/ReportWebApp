import React, { useContext, useState } from 'react';

import { TextField } from '@mui/material';

import classes from './DeleteStudyProtectorModal.module.scss';
import { deleteStudy } from '../../../axios/api';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { NotificationContext } from '../../../context/notification-context';
import ConfigService from '../../../service/config-service';
import { isEmptyOrNil } from '../../../utils/general';

interface Props {
    studyInstanceUid: string;
    onConfirmCallback: () => void;
}

const DeleteStudyProtectorModal = ({ studyInstanceUid, onConfirmCallback }: Props) => {
    const setModal = useContext(ModalContext);
    const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
    const [password, setPassword] = useState('');

    const onClose = () => {
        setModal(null);
    };

    const onConfirm = () => {
        deleteStudy(studyInstanceUid, password).subscribe({
            next: () => {
                onConfirmCallback();
                setSuccessNotification('Delete study success');
                onClose();
            },
            error: (error) => {
                setErrorNotification(error.response?.data.Message || 'Error occurs');
            },
        });
    };

    const body = (
        <div className={classes.container}>
            <div>Are you sure to delete the study?</div>
            {ConfigService.getEnableDeleteProtection() && (
                <div style={{ marginTop: '12px', width: '100%' }}>
                    <TextField
                        fullWidth
                        type="password"
                        autoComplete="off"
                        label="Enter password here"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            )}
        </div>
    );

    const footer = (
        <>
            <Button theme="reversePrimary" onClick={() => onClose()}>
                Cancel
            </Button>
            <Button
                disabled={ConfigService.getEnableDeleteProtection() && isEmptyOrNil(password)}
                theme="primary"
                onClick={() => onConfirm()}
            >
                Confirm
            </Button>
        </>
    );

    return (
        <Modal open width="auto" height="auto" headerTitle="Message" body={body} footer={footer} />
    );
};

export default DeleteStudyProtectorModal;
