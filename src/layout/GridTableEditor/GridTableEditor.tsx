import React, { useEffect } from 'react';

import { Button } from '@mui/material';
import { ColDef, RowNode } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';

import GridTable from '../../components/GridTable/GridTable';
import { useGridTable } from '../../hooks/useGridTable';
import { FormEditorDef } from '../../interface/form-editor-define';
import classes from './GridTableEditor.module.scss';

interface Props {
    apiPath: string;
    enableApi?: boolean;
    filterRow?: boolean;
    identityId: string;
    subIdentityId?: string;
    colDef: ColDef[];
    formDef: FormEditorDef;
    enableButtonBar?: boolean;
    enableEdit?: boolean;
    enableDelete?: boolean;
    initFormData: any;
    addCallBack?: () => void;
    updateCallBack?: () => void;
    deleteCallBack?: () => void;
    onSelectionChanged?: (gridApi: GridApi) => void;
    filterRowFunction?: (node: RowNode) => boolean;
    isFilterActivate?: () => boolean;
}

const GridTableEditor = ({
    apiPath,
    enableApi = true,
    identityId,
    subIdentityId = '',
    filterRow = false,
    colDef,
    formDef,
    enableButtonBar = true,
    enableEdit = true,
    enableDelete = true,
    initFormData,
    deleteCallBack,
    addCallBack,
    updateCallBack,
    onSelectionChanged,
    filterRowFunction,
    isFilterActivate,
}: Props) => {
    const { gridApi, rowData, colDefs, getRowNodeId, gridReady, openEditor } = useGridTable<any[]>({
        formDef,
        apiPath,
        enableApi,
        identityId,
        subIdentityId,
        colDef,
        deleteCallBack,
        addCallBack,
        updateCallBack,
        initFormData,
        enableEdit,
        enableDelete,
    });

    useEffect(() => {
        gridApi?.current?.onFilterChanged();
    }, [filterRow, gridApi]);

    return (
        <>
            <div className={`ag-theme-dark ${classes.gridContainer}`}>
                <div className={classes.buttonGroup}>
                    {enableButtonBar && (
                        <Button variant="text" onClick={() => openEditor(initFormData, 'add')}>
                            Add Row
                        </Button>
                    )}
                </div>
                <GridTable
                    rowSelection="single"
                    columnDefs={colDefs}
                    rowData={rowData || []}
                    gridReady={gridReady}
                    getRowNodeId={getRowNodeId}
                    onSelectionChanged={onSelectionChanged}
                    isFilterActivate={isFilterActivate}
                    filterRowFunction={filterRowFunction}
                />
            </div>
        </>
    );
};

export default GridTableEditor;
