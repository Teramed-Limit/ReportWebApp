import React, { useContext, useState } from 'react';

import cx from 'classnames';

import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { Diagram } from '../../../interface/diagram';
import { useReportDataStore } from '../../../models/useStore';
import { isEmptyOrNil } from '../../../utils/general';
import classes from './DiagramSelectModal.module.scss';

interface Props {
    diagramList: Diagram[];
}

const DiagramSelectModal = ({ diagramList }: Props) => {
    const setModal = useContext(ModalContext);
    const [selectedNumber, setSelectedNumber] = useState(-1);
    const [selectedDiagram, setSelectedDiagram] = useState('');
    const { valueChanged } = useReportDataStore();

    const onClose = () => {
        setModal(null);
    };

    const onConfirmSelect = () => {
        valueChanged('DiagramData', selectedDiagram);
        onClose();
    };

    const onSelect = (id: number) => {
        const diagram = diagramList.find((image) => image.Number === id);
        setSelectedNumber(diagram?.Number || -1);
        setSelectedDiagram(diagram?.DiagramData || '');
    };

    const body = (
        <div className={classes.container}>
            {diagramList.map((diagram) => {
                const imageSrc = `data:image/jpg;base64, ${diagram.DiagramData}`;
                return (
                    <div
                        className={cx(classes.imageContainer, {
                            [classes.selected]: selectedNumber === diagram.Number,
                        })}
                        key={diagram.Number}
                        onClick={() => onSelect(diagram.Number)}
                        onDoubleClick={() => {
                            onSelect(diagram.Number);
                            onConfirmSelect();
                        }}
                    >
                        <img draggable={false} src={imageSrc} alt="None" />
                        {diagram.DisplayName}
                    </div>
                );
            })}
        </div>
    );
    const footer = (
        <>
            <Button
                disabled={isEmptyOrNil(selectedDiagram)}
                theme="primary"
                onClick={() => onConfirmSelect()}
            >
                Select
            </Button>
            <Button theme="reversePrimary" onClick={() => onClose()}>
                Cancel
            </Button>
        </>
    );

    return (
        <Modal
            open
            width="80%"
            height="80%"
            onClose={() => onClose()}
            headerTitle="New Diagram"
            body={body}
            footer={footer}
        />
    );
};

export default DiagramSelectModal;
