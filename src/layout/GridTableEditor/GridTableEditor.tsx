import React, { useEffect } from 'react';

import { Button } from '@mui/material';
import { ColDef, GetRowIdParams, RowNode } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { Observable } from 'rxjs';

import classes from './GridTableEditor.module.scss';
import GridTable from '../../components/GridTable/GridTable';
import { useGridTable } from '../../hooks/useGridTable';
import { FormEditorDef } from '../../interface/form-editor-define';
import { camelize } from '../../utils/general';

interface Props {
    domLayout?: 'normal' | 'autoHeight' | 'print';
    apiPath: string;
    initFormData: any;
    initRowData?: any[];
    externalGetRowData?: Observable<any>;
    externalUpdateRowApi?: (formData: any) => Observable<any>;
    filterRow?: boolean;
    identityId: string;
    subIdentityId?: string;
    colDef: ColDef[];
    formDef: FormEditorDef;
    enableButtonBar?: boolean;
    enableEdit?: boolean;
    enableDelete?: boolean;
    addCallBack?: () => void;
    updateCallBack?: () => void;
    deleteCallBack?: () => void;
    onSelectionChanged?: (gridApi: GridApi) => void;
    filterRowFunction?: (node: RowNode) => boolean;
    isFilterActivate?: () => boolean;
}

const GridTableEditor = ({
    domLayout = 'normal',
    apiPath,
    initFormData,
    initRowData,
    externalGetRowData,
    externalUpdateRowApi,
    identityId,
    subIdentityId = '',
    filterRow = false,
    colDef,
    formDef,
    enableButtonBar = true,
    enableEdit = true,
    enableDelete = true,
    deleteCallBack,
    addCallBack,
    updateCallBack,
    onSelectionChanged,
    filterRowFunction,
    isFilterActivate,
}: Props) => {
    const { gridApi, rowData, colDefs, gridReady, openEditor } = useGridTable({
        formDef,
        initRowData,
        externalGetRowData,
        externalUpdateRowApi,
        apiPath,
        identityId,
        subIdentityId,
        colDef,
        deleteCallBack,
        addCallBack,
        updateCallBack,
        enableEdit,
        enableDelete,
    });

    // each row of unique id, use on ag-grid grid rowdata CRUD, Filter etc...
    const getRowNodeId = (params: GetRowIdParams) => {
        return params.data[identityId];
    };

    useEffect(() => {
        gridApi?.current?.onFilterChanged();
    }, [filterRow, gridApi]);

    return (
        <>
            <div className={`ag-theme-modal ${classes.gridContainer}`}>
                <div className={classes.buttonGroup}>
                    {enableButtonBar && (
                        <Button variant="text" onClick={() => openEditor(initFormData, 'add')}>
                            Add {camelize(apiPath)}
                        </Button>
                    )}
                </div>
                <GridTable
                    domLayout={domLayout}
                    rowSelection="single"
                    columnDefs={colDefs}
                    rowData={rowData || []}
                    gridReady={gridReady}
                    getRowId={getRowNodeId}
                    onSelectionChanged={onSelectionChanged}
                    isFilterActivate={isFilterActivate}
                    filterRowFunction={filterRowFunction}
                />
            </div>
        </>
    );
};

export default GridTableEditor;
