import React, { useContext, useEffect, useState } from 'react';

import QualityIndicatorModal from '../container/Modals/QualityIndicatorModal/QualityIndicatorModal';
import { ModalContext } from '../context/modal-context';
import { isEmptyOrNil } from '../utils/general';

const modalMapper = {
    colonoscopyQualityIndicators: <QualityIndicatorModal />,
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
