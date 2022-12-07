import React, { CSSProperties, useContext } from 'react';

import { observer } from 'mobx-react';

import Modal from '../../../../components/Modal/Modal';
import PdfCreator from '../../../../components/PdfCreator/PdfCreator';
import Button from '../../../../components/UI/Button/Button';
import { ModalContext } from '../../../../context/modal-context';

const ReportHistoryActionBar: React.FC = () => {
    const setModal = useContext(ModalContext);

    return (
        <>
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
                            headerTitle="PDF Preview"
                            body={<PdfCreator />}
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

export default observer(ReportHistoryActionBar);
