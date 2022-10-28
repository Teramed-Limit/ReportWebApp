import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AxiosError, AxiosResponse } from 'axios';
import { AxiosObservable } from 'axios-observable/dist/axios-observable.interface';

import { axiosIns } from '../axios/axios';
import FormEditorModal from '../container/Modals/FormEditorModal/FormEditorModal';
import { ModalContext } from '../context/modal-context';
import { NotificationContext } from '../context/notification-context';
import { FormEditorDef } from '../interface/form-editor-define';
import { MessageType } from '../interface/notification';

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

interface Props {
    // default row data form parent, and not use fetch api to request row data
    initRowData?: any[];
    // base api scheme, corresponds to backend api controller
    apiPath: string;
    // if api has different format, user can define their own api path
    externalGetRowData?: AxiosObservable<any>;
    // if api has different format, user can define their own api path
    externalUpdateRowApi?: (formData: any) => AxiosObservable<any>;
    // if api has different format, user can define their own api path
    externalDeleteRowApi?: () => AxiosObservable<any>;
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
    // edit button cell visibility
    enableEdit: boolean;
    // delete button cell visibility
    enableDelete: boolean;
    updateCallBack?: () => void;
    deleteCallBack?: () => void;
    addCallBack?: () => void;
}

export const useGridTable = ({
    initRowData,
    formDef,
    apiPath,
    identityId,
    colDef,
    enableEdit,
    enableDelete,
    addCallBack,
    updateCallBack,
    deleteCallBack,
    externalGetRowData,
}: Props) => {
    const gridApi = useRef<GridApi | null>(null);
    const setModal = useContext(ModalContext);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [rowData, setRowData] = useState(initRowData || []);
    const { openNotification: setNotification } = useContext(NotificationContext);

    // get initial rowdata from api
    const getRowData = useCallback(() => {
        // data from parent
        if (initRowData) {
            setRowData(initRowData);
            return;
        }

        const fetch$ = externalGetRowData || axiosIns.get(`api/${apiPath}`);
        const subscription = fetch$.subscribe({
            next: (res: AxiosResponse) => {
                setRowData(res.data);
            },
            error: (err: AxiosError) => {
                setRowData([]);
                setNotification(
                    MessageType.Error,
                    err.response?.data.Message || 'Http request failed!',
                );
            },
        });
        return () => subscription.unsubscribe();
    }, [apiPath, externalGetRowData, initRowData, setNotification]);

    // use prop `enable` to control whether to get row data when the component renders
    useEffect(() => {
        getRowData();
    }, [getRowData]);

    // delete row api
    const deleteRow = useCallback(
        (cellRendererParams: ICellRendererParams) => {
            gridApi?.current?.showLoadingOverlay();
            const id = cellRendererParams.data[identityId];
            const subscription = axiosIns.delete(`api/${apiPath}/${identityId}/${id}`).subscribe({
                next: () => {
                    gridApi?.current?.applyTransaction({ remove: [cellRendererParams.data] });
                    gridApi?.current?.hideOverlay();
                    deleteCallBack?.();
                },
                error: (err) => {
                    gridApi?.current?.hideOverlay();
                    setNotification(
                        MessageType.Error,
                        err.response?.data.Message || 'Http request failed!',
                    );
                },
            });

            return () => subscription.unsubscribe();
        },
        [apiPath, deleteCallBack, identityId, setNotification],
    );

    // insert row api
    const addRow = useCallback(
        (formData) => {
            gridApi?.current?.showLoadingOverlay();
            const subscription = axiosIns.post(`api/${apiPath}/${identityId}`, formData).subscribe({
                next: () => {
                    gridApi?.current?.hideOverlay();
                    setModal(null);
                    gridApi?.current?.applyTransaction({ add: [formData], addIndex: 0 });
                    addCallBack?.();
                },
                error: (err) => {
                    gridApi?.current?.hideOverlay();
                    setNotification(
                        MessageType.Error,
                        err.response?.data.Message || 'Http request failed!',
                    );
                },
            });

            return () => subscription.unsubscribe();
        },
        [addCallBack, apiPath, identityId, setModal, setNotification],
    );

    // update row api
    const updateRow = useCallback(
        (formData) => {
            gridApi?.current?.showLoadingOverlay();
            const subscription = axiosIns
                .post(`api/${apiPath}/${identityId}/${formData[identityId]}`, formData)
                .subscribe({
                    next: () => {
                        setModal(null);
                        gridApi?.current?.applyTransaction({ update: [formData] });
                        const rowNode = gridApi?.current?.getRowNode(formData[identityId]);
                        if (!rowNode) return;
                        updateCallBack?.();
                        gridApi?.current?.refreshCells({ force: true, rowNodes: [rowNode] });
                        gridApi?.current?.hideOverlay();
                    },
                    error: (err) => {
                        gridApi?.current?.hideOverlay();
                        setNotification(
                            MessageType.Error,
                            err.response?.data.Message || 'Http request failed!',
                        );
                    },
                });

            return () => subscription.unsubscribe();
        },
        [apiPath, identityId, setModal, setNotification, updateCallBack],
    );

    // callback when ag-grid all api are available
    const gridReady = (params: GridReadyEvent) => (gridApi.current = params.api);

    // open form editor and initialize
    const openEditor = useCallback(
        (formData, type: string) => {
            setModal(
                <FormEditorModal
                    initFormData={formData}
                    saveType={type}
                    formDef={formDef}
                    addRow={addRow}
                    updateRow={updateRow}
                />,
            );
        },
        [addRow, formDef, setModal, updateRow],
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
        gridReady,
    };
};
