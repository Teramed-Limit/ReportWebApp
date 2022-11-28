import React, { useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, FilterChangedEvent, RowNode } from 'ag-grid-community';
import { GetRowIdFunc } from 'ag-grid-community/dist/lib/entities/gridOptions';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import cx from 'classnames';

import { CellMapper } from './GridCell/cell-mapper';
import classes from './GridTable.module.scss';

interface TableProps {
    domLayout?: 'normal' | 'autoHeight' | 'print';
    columnDefs: ColDef[];
    rowData: any[];
    onSelectionChanged?: (param) => void;
    onFirstDataRendered?: (param) => void;
    rowSelection?: 'single' | 'multiple';
    checkboxSelect?: boolean;
    gridReady?: (gridReadyEvent: GridReadyEvent) => void;
    getRowId?: GetRowIdFunc;
    filterRowFunction?: (node: RowNode) => boolean;
    isFilterActivate?: () => boolean;
    onFilterChanged?: (event: FilterChangedEvent) => void;
}

function isFirstColumn(params) {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    return displayedColumns[0] === params.column;
}

function GridTable({
    domLayout = 'normal',
    columnDefs,
    rowData,
    onSelectionChanged,
    onFirstDataRendered,
    checkboxSelect = true,
    rowSelection = 'multiple',
    gridReady,
    getRowId,
    filterRowFunction,
    isFilterActivate,
    onFilterChanged,
}: TableProps) {
    const gridApi = useRef<GridApi | null>(null);

    const onGridReady = (params: GridReadyEvent) => {
        gridApi.current = params.api;
        gridReady?.(params);
    };

    return (
        <AgGridReact
            domLayout={domLayout}
            rowClass={cx(classes.row)}
            defaultColDef={{
                resizable: true,
            }}
            isExternalFilterPresent={isFilterActivate}
            doesExternalFilterPass={filterRowFunction}
            onGridReady={onGridReady}
            rowData={rowData}
            rowMultiSelectWithClick={checkboxSelect}
            rowSelection={rowSelection}
            onFirstDataRendered={(event) =>
                onFirstDataRendered ? onFirstDataRendered(event.api) : null
            }
            onSelectionChanged={(event) =>
                onSelectionChanged ? onSelectionChanged(event.api) : null
            }
            getRowId={getRowId}
            components={{ ...CellMapper }}
            tooltipShowDelay={0}
            onFilterChanged={(e) => onFilterChanged?.(e)}
        >
            {columnDefs.map((col) => (
                <AgGridColumn
                    key={col.field}
                    headerClass={classes.header}
                    headerName={col.headerName}
                    field={col.field}
                    sortable
                    resizable={col.resizable || true}
                    valueFormatter={col.valueFormatter}
                    headerCheckboxSelection={rowSelection === 'multiple' && isFirstColumn}
                    checkboxSelection={rowSelection === 'multiple' && isFirstColumn}
                    hide={col.hide}
                    flex={col.flex}
                    width={col.width}
                    filter={col.filter}
                    filterParams={col.filterParams}
                    floatingFilter={col.floatingFilter}
                    cellStyle={col.cellStyle}
                    cellRenderer={col.cellRenderer}
                    cellRendererParams={col.cellRendererParams}
                    cellEditor={col.cellEditor}
                    cellEditorParams={col.cellEditorParams}
                    tooltipField={col.tooltipField}
                    tooltipComponent={col.tooltipComponent}
                    editable={col.editable}
                    pinned={col.pinned}
                />
            ))}
        </AgGridReact>
    );
}

export default GridTable;
