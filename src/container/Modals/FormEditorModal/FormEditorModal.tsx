import React, { useCallback, useContext, useState } from 'react';

import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import '../../../styles/ag-grid/ag-theme-modal.scss';
import { ModalContext } from '../../../context/modal-context';
import { FormEditorDef } from '../../../interface/form-editor-define';
import FormEditor from '../../../layout/FormEditor/FormEditor';

interface Props {
    initFormData: any;
    saveType: string;
    formDef: FormEditorDef;
    addRow: (formData: any) => void;
    updateRow: (formData: any) => void;
}

const FormEditorModal = ({ initFormData, saveType, formDef, addRow, updateRow }: Props) => {
    const setModal = useContext(ModalContext);
    const [formIsValid, setFormIsValid] = useState(false);
    const [editFormData, setEditFormData] = useState<any>(initFormData);

    const updateFormData = useCallback((fieldId: string, value: string) => {
        setEditFormData((data) => ({ ...data, [fieldId]: value }));
    }, []);

    return (
        <Modal
            open
            width="50%"
            height="fit-content"
            headerTitle="Edit"
            body={
                <FormEditor
                    saveType={saveType}
                    formDef={formDef}
                    formData={editFormData}
                    formDataChanged={updateFormData}
                    formInvalidChanged={setFormIsValid}
                />
            }
            footer={
                <>
                    <Button theme="reversePrimary" fontSize={16} onClick={() => setModal(null)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!formIsValid}
                        theme="primary"
                        fontSize={16}
                        onClick={() =>
                            saveType === 'add' ? addRow(editFormData) : updateRow(editFormData)
                        }
                    >
                        Confirm
                    </Button>
                </>
            }
        />
    );
};

export default FormEditorModal;
