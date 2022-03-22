import React, { useContext, useEffect, useState } from 'react';

import { FindingTemplateProvider } from '../container/Modals/FillInDetailsModal/context/finding-template-context';
import FillInDetailsModal from '../container/Modals/FillInDetailsModal/FillInDetailsModal';
import QualityIndicatorModal from '../container/Modals/QualityIndicatorModal/QualityIndicatorModal';
import { ModalContext } from '../context/modal-context';
import { isEmptyOrNil } from '../utils/general';

const modalMapper = {
    QualityIndicator: <QualityIndicatorModal />,
    FindingTemplate: (
        <FindingTemplateProvider>
            <FillInDetailsModal />
        </FindingTemplateProvider>
    ),
};

export function useModal() {
    const [modalName, setModalName] = useState('');
    const setModal = useContext(ModalContext);

    useEffect(() => {
        if (isEmptyOrNil(modalName) && isEmptyOrNil(modalMapper[modalName])) {
            return;
        }

        setModal(modalMapper[modalName]);
        setModalName('');
    }, [modalName, setModal]);

    return [setModalName];
}
