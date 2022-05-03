import React, { useContext } from 'react';

import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import classes from './MessageModal.module.scss';

interface Props {
    headerTitle: string;
    bodyContent: string;
    onConfirmCallback?: () => void;
}

const MessageModal = ({ headerTitle, bodyContent, onConfirmCallback }: Props) => {
    const setModal = useContext(ModalContext);

    const onClose = () => {
        setModal(null);
    };

    const onConfirm = () => {
        onConfirmCallback?.();
        onClose();
    };

    const body = <div className={classes.container}>{bodyContent}</div>;

    const footer = (
        <>
            <Button theme="reversePrimary" onClick={() => onClose()}>
                Cancel
            </Button>
            <Button theme="primary" onClick={() => onConfirm()}>
                Confirm
            </Button>
        </>
    );

    return (
        <Modal
            open
            width="auto"
            height="auto"
            onClose={() => onClose()}
            headerTitle={headerTitle}
            body={body}
            footer={footer}
        />
    );
};

export default MessageModal;
