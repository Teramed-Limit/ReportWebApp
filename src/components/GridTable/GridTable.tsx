import React, { useEffect, useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import cx from 'classnames';

import classes from './GridTable.module.scss';

interface TableProps {
    columnDefs: ColDef[];
    rowData: any[];
    onSelectionChanged?: (param) => void;
    onFirstDataRendered?: (param) => void;
    disabled: boolean;
    rowSelection?: string;
    frameworkComponents?: { [p: string]: any };
}

function isFirstColumn(params) {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    return displayedColumns[0] === params.column;
}

// TODO: performance issue
function GridTable({
    columnDefs,
    rowData,
    onSelectionChanged,
    onFirstDataRendered,
    disabled,
    rowSelection = 'multiple',
    frameworkComponents,
}: TableProps) {
    const disabledState = useRef<boolean>(disabled);
    const gridApi = useRef<GridApi | null>(null);

    disabledState.current = disabled;
    const onGridReady = (params: GridReadyEvent) => (gridApi.current = params.api);

    useEffect(() => {
        gridApi.current?.refreshHeader();
        gridApi.current?.refreshCells({ force: true });
    });

    return (
        <AgGridReact
            rowClass={cx(classes.row)}
            defaultColDef={{
                resizable: true,
            }}
            onGridReady={onGridReady}
            rowData={rowData}
            rowMultiSelectWithClick
            rowSelection={rowSelection}
            suppressRowClickSelection={disabled}
            onFirstDataRendered={(event) =>
                onFirstDataRendered ? onFirstDataRendered(event.api) : null
            }
            onSelectionChanged={(event) =>
                onSelectionChanged ? onSelectionChanged(event.api) : null
            }
            frameworkComponents={frameworkComponents}
            tooltipShowDelay={0}
        >
            {columnDefs.map((col) => (
                <AgGridColumn
                    headerClass={classes.header}
                    headerName={col.headerName}
                    key={col.field}
                    field={col.field}
                    sortable
                    resizable={col.resizable || true}
                    valueFormatter={col.valueFormatter}
                    headerCheckboxSelection={
                        !disabledState.current && rowSelection === 'multiple' && isFirstColumn
                    }
                    checkboxSelection={rowSelection === 'multiple' && isFirstColumn}
                    cellClassRules={{ [classes.disabled]: () => disabledState.current }}
                    hide={col.hide}
                    flex={col.flex}
                    width={col.width}
                    cellRenderer={col.cellRenderer}
                    tooltipField={col.tooltipField}
                    tooltipComponent={col.tooltipComponent}
                />
            ))}
        </AgGridReact>
    );
}

export default GridTable;
