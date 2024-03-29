import React, { useContext } from 'react';

import classes from './MessageModal.module.scss';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';

interface Props {
    headerTitle: string;
    bodyContent: string;
    onConfirmCallback?: () => void;
    children?: React.ReactNode;
}

const MessageModal = ({ headerTitle, bodyContent, children, onConfirmCallback }: Props) => {
    const setModal = useContext(ModalContext);

    const onClose = () => {
        setModal(null);
    };

    const onConfirm = () => {
        onConfirmCallback?.();
        onClose();
    };

    const body = (
        <div className={classes.container}>
            <div>{bodyContent}</div>
            {children}
        </div>
    );

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
            headerTitle={headerTitle}
            body={body}
            footer={footer}
        />
    );
};

export default MessageModal;
