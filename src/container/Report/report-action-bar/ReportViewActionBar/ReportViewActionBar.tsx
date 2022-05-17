import React, { CSSProperties, useContext } from 'react';

import { observer } from 'mobx-react';

import Modal from '../../../../components/Modal/Modal';
import PdfCreator from '../../../../components/PdfCreator/PdfCreator';
import Button from '../../../../components/UI/Button/Button';
import { ModalContext } from '../../../../context/modal-context';
import { useReportDataStore } from '../../../../models/useStore';
import MessageModal from '../../../Modals/MessageModal/MessageModal';

const ReportViewActionBar: React.FC = () => {
    const { modify } = useReportDataStore();
    const setModal = useContext(ModalContext);

    const onEdit = () => {
        setModal(
            <MessageModal
                headerTitle="Message"
                bodyContent="If you edit the report again, you must re-signOff the report."
                onConfirmCallback={() => modify()}
            />,
        );
    };

    return (
        <>
            <Button
                theme="primary"
                icon="save"
                iconPosition="left"
                fontSize={16}
                onClick={() => onEdit()}
            >
                Edit
            </Button>
            <Button
                theme="primary"
                icon="print"
                iconPosition="left"
                fontSize={16}
                onClick={() => {
                    setModal(
                        <Modal
                            open
                            width="80%"
                            height="80%"
                            overflow="hidden hidden"
                            onClose={() => setModal(null)}
                            headerTitle="PDF Preview"
                            body={<PdfCreator showToolbar />}
                            bodyCSS={{ padding: '0' } as CSSProperties}
                            footer={
                                <Button theme="reversePrimary" onClick={() => setModal(null)}>
                                    Close
                                </Button>
                            }
                        />,
                    );
                }}
            >
                Print
            </Button>
        </>
    );
};

export default observer(ReportViewActionBar);
