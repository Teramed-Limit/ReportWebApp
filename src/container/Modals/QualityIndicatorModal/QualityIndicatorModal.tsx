import React, { useContext, useEffect, useState } from 'react';

import { observer } from 'mobx-react';

import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { colonoscopyDefine } from '../../../constant/colonoscopy-define';
import { ModalContext } from '../../../context/modal-context';
import { Section } from '../../../interface/define';
import ReportSection from '../../../layout/ReportSection/ReportSection';
import { useReportDataStore } from '../../../models/useStore';
import classes from '../../Report/Report.module.scss';

const DialogContext = React.createContext<{ [propName: string]: (actionParams) => void }>({});

const QualityIndicatorModal = () => {
    const setModal = useContext(ModalContext);
    const [disabled, setDisabled] = useState(true);
    const {
        qualityModelIsValid,
        formData,
        formState,
        resetFormData,
        resetFormState,
    } = useReportDataStore();
    const [originalFormData, setOriginalFormData] = useState(formData.toJSON());
    const [originalFormState, setOriginalFormState] = useState(formState.toJSON());

    useEffect(() => {
        setOriginalFormData({ ...formData.toJSON() });
        setOriginalFormState({ ...formState.toJSON() });
    }, [formData, formState]);

    const onConfirm = () => {
        setModal(null);
    };

    const onClose = () => {
        resetFormData(originalFormData);
        resetFormState(originalFormState);
        setModal(null);
    };

    useEffect(() => {
        setDisabled(!qualityModelIsValid);
    }, [qualityModelIsValid]);

    const body = (
        <div className={classes.container}>
            {colonoscopyDefine.modal.sections.map((section: Section) => (
                <ReportSection key={section.id} section={section} actionContext={DialogContext} />
            ))}
        </div>
    );

    const footer = (
        <>
            <Button disabled={disabled} theme="primary" fontSize={16} onClick={onConfirm}>
                Confirm
            </Button>
            <Button theme="reversePrimary" fontSize={16} onClick={onClose}>
                Cancel
            </Button>
        </>
    );

    return (
        <Modal
            open
            onClose={onClose}
            headerTitle="Colonoscopy Quantity Indicator"
            body={body}
            footer={footer}
            height="95%"
        />
    );
};

export default observer(QualityIndicatorModal);
