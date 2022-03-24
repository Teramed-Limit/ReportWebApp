import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AxiosError, AxiosResponse } from 'axios';

import { axiosIns } from '../axios/axios';
import Modal from '../components/Modal/Modal';
import Button from '../components/UI/Button/Button';
import { ModalContext } from '../context/modal-context';
import { NotificationContext } from '../context/notification-context';
import { FormEditorDef } from '../interface/form-editor-define';
import { MessageType } from '../interface/notification';
import FormEditor from '../layout/FormEditor/FormEditor';
import { isEmptyOrNil } from '../utils/general';

export type DeleteRowClick = (cellRendererParams: ICellRendererParams) => void;
export type EditRowClick = (formData: any, type: string) => void;

const gridDeleteActionButton = (onClick: DeleteRowClick): ColDef[] => [
    {
        field: 'deleteAction',
        headerName: '',
        width: 40,
        cellStyle: { padding: 0 },
        cellRenderer: 'deleteRowRenderer',
        cellRendererParams: {
            onClick,
        },
    },
];

const gridEditActionButton = (onClick: EditRowClick): ColDef[] => [
    {
        field: 'editAction',
        headerName: '',
        width: 40,
        cellStyle: { padding: 0 },
        cellRenderer: 'editRowRenderer',
        cellRendererParams: {
            onClick,
        },
    },
];

interface Props<T> {
    // base api scheme, corresponds to backend api controller
    apiPath: string;
    // use prop `enable` to control whether to get row data when the component renders
    enableApi: boolean;
    // following restapi
    // Create(Post) : {apiPath}/{identityId} e.g. api/role/name
    // Read(Get)   : {apiPath}/{identityId} e.g. api/role/name
    // Update(Post) : {apiPath}/{identityId}/{row identityId of value} e.g. api/role/name/admin
    // Delete(Delete) : {apiPath}/{identityId}/{row identityId of value} e.g. api/role/name/admin
    // each row of unique id and apiPath CRUD
    identityId: string;
    // use `subIdentityId` if `identityId` is not
    subIdentityId: string;
    // define of grid cell
    colDef: ColDef[];
    // define of form editor
    formDef: FormEditorDef;
    // init form data when insert new row
    initFormData: T;
    // edit button cell visibility
    enableEdit: boolean;
    // delete button cell visibility
    enableDelete: boolean;
    updateCallBack?: () => void;
    deleteCallBack?: () => void;
    addCallBack?: () => void;
}

export const useGridTable = <T,>({
    formDef,
    apiPath,
    enableApi,
    identityId,
    subIdentityId,
    colDef,
    enableEdit,
    enableDelete,
    initFormData,
    addCallBack,
    updateCallBack,
    deleteCallBack,
}: Props<T>) => {
    const gridApi = useRef<GridApi | null>(null);
    const [, setFormIsValid] = useState(false);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [editFormData, setEditFormData] = useState<T>(initFormData);
    const [saveType, setSaveType] = useState<string>('add');
    const [rowData, setRowData] = useState([]);
    const { setNotification } = useContext(NotificationContext);
    const setModal = useContext(ModalContext);

    // get initial rowdata from api
    const getRowData = useCallback(
        () =>
            axiosIns.get(apiPath).subscribe({
                next: (res: AxiosResponse) => {
                    setRowData(res.data);
                    gridApi?.current?.onFilterChanged();
                },
                error: (err: AxiosError) => {
                    setRowData([]);
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            }),
        [apiPath, setNotification],
    );

    // use prop `enable` to control whether to get row data when the component renders
    useEffect(() => {
        if (!enableApi) return;
        const subscription = getRowData();
        return subscription.unsubscribe;
    }, [apiPath, enableApi, getRowData]);

    // each row of unique id, use on ag-grid grid rowdata CRUD, Filter etc...
    const getRowNodeId = useCallback(
        (data) => {
            if (!isEmptyOrNil(subIdentityId)) {
                return `${data[identityId]}_${data[subIdentityId]}`;
            }
            return data[identityId];
        },
        [identityId, subIdentityId],
    );

    // delete row api
    const deleteRow = useCallback(
        (cellRendererParams: ICellRendererParams) => {
            const id = cellRendererParams.data[identityId];
            axiosIns.delete(`${apiPath}/${identityId}/${id}`).subscribe({
                next: () => {
                    gridApi?.current?.applyTransaction({ remove: [cellRendererParams.data] });
                    deleteCallBack?.();
                },
                error: (err) => {
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        },
        [apiPath, deleteCallBack, identityId, setNotification],
    );

    // insert row api
    const addRow = useCallback(
        (formData) => {
            axiosIns.post(`${apiPath}/${identityId}`, formData).subscribe({
                next: () => {
                    setModal(null);
                    setEditFormData(initFormData);
                    gridApi?.current?.applyTransaction({ add: [formData], addIndex: 0 });
                    addCallBack?.();
                },
                error: (err) => {
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        },
        [apiPath, identityId, setModal, initFormData, addCallBack, setNotification],
    );

    // update row api
    const updateRow = useCallback(
        (formData) => {
            axiosIns.post(`${apiPath}/${identityId}/${formData[identityId]}`, formData).subscribe({
                next: () => {
                    setModal(null);
                    setEditFormData(initFormData);
                    gridApi?.current?.applyTransaction({ update: [formData] });
                    const rowNode = gridApi?.current?.getRowNode(getRowNodeId(formData));
                    if (!rowNode) return;
                    gridApi?.current?.refreshCells({ force: true, rowNodes: [rowNode] });
                    updateCallBack?.();
                },
                error: (err) => {
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        },
        [
            apiPath,
            getRowNodeId,
            identityId,
            initFormData,
            setModal,
            setNotification,
            updateCallBack,
        ],
    );

    // callback when ag-grid all api are available
    const gridReady = (params: GridReadyEvent) => (gridApi.current = params.api);

    const updateFormData = useCallback((fieldId: string, value: string) => {
        setEditFormData((data) => ({ ...data, [fieldId]: value }));
    }, []);

    // open form editor and initialize
    const openEditor = useCallback(
        (formData, type: string) => {
            setEditFormData(formData);
            setSaveType(type);
            setModal(
                <Modal
                    open
                    width="80%"
                    height="80%"
                    onClose={() => setModal(null)}
                    headerTitle={saveType === 'add' ? 'Create' : 'Edit'}
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
                            <Button
                                disabled={false}
                                theme="primary"
                                fontSize={16}
                                onClick={() =>
                                    saveType === 'add'
                                        ? addRow(editFormData)
                                        : updateRow(editFormData)
                                }
                            >
                                Confirm
                            </Button>
                            <Button
                                theme="reversePrimary"
                                fontSize={16}
                                onClick={() => setModal(null)}
                            >
                                Cancel
                            </Button>
                        </>
                    }
                />,
            );
        },
        [addRow, editFormData, formDef, saveType, setModal, updateFormData, updateRow],
    );

    // dispatch edit event and delete event on cell button
    useEffect(() => {
        let mutateColDef: ColDef[] = [...colDef];

        if (enableEdit) {
            mutateColDef = [...gridEditActionButton(openEditor), ...mutateColDef];
        }

        if (enableDelete) {
            mutateColDef = [...gridDeleteActionButton(deleteRow), ...mutateColDef];
        }

        setColDefs(mutateColDef);
    }, [colDef, deleteRow, enableDelete, enableEdit, openEditor]);

    return {
        gridApi,
        rowData,
        colDefs,
        openEditor,
        getRowNodeId,
        gridReady,
    };
};
