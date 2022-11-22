import React, { useContext, useEffect, useState } from 'react';

import { observer } from 'mobx-react';

import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { Section } from '../../../interface/define';
import ReportSection from '../../../layout/ReportSection/ReportSection';
import { useReportDataStore, useReportDefineStore } from '../../../models/useStore';
import classes from '../../Report/Report.module.scss';

const DialogContext = React.createContext<{ [propName: string]: (actionParams) => void }>({});

const QualityIndicatorModal = () => {
    const setModal = useContext(ModalContext);
    const { formDefine } = useReportDefineStore();
    const { formData, formState, resetFormData, resetFormState } = useReportDataStore();

    const [originalFormData, setOriginalFormData] = useState(formData.toJSON());
    const [originalFormState, setOriginalFormState] = useState(formState.toJSON());

    useEffect(() => {
        setOriginalFormData({ ...formData.toJSON() });
        setOriginalFormState({ ...formState.toJSON() });
    }, [formData, formState]);

    useEffect(() => {}, [formState]);

    const onConfirm = () => {
        setModal(null);
    };

    const onClose = () => {
        resetFormData(originalFormData);
        resetFormState(originalFormState);
        setModal(null);
    };

    const body = (
        <div className={classes.container}>
            {formDefine?.modal &&
                formDefine.modal.sections.map((section: Section) => (
                    <ReportSection
                        key={section.id}
                        section={section}
                        actionContext={DialogContext}
                    />
                ))}
        </div>
    );

    const footer = (
        <>
            <Button theme="primary" fontSize={16} onClick={onConfirm}>
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
            headerTitle="Colonoscopy Quantity Indicator"
            body={body}
            footer={footer}
            height="95%"
        />
    );
};

export default observer(QualityIndicatorModal);
