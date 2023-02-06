import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Stack } from '@mui/material';
import { ColDef, ColumnApi } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { format, sub } from 'date-fns';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { fetchHistoryStudy } from '../../axios/api';
import GridTable from '../../components/GridTable/GridTable';
import { define } from '../../constant/setting-define';
import { useGridColDef } from '../../hooks/useGridColDef';
import { useRoleFunctionAvailable } from '../../hooks/useRoleFunctionAvailable';
import { StudyData } from '../../interface/study-data';
import classes from '../Query/Query.module.scss';

function History() {
    const history = useHistory();
    const [rowData, setRowData] = useState<StudyData[]>([]);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string>('');
    // function available
    const { checkAvailable } = useRoleFunctionAvailable();
    // dispatch event for cell event
    const { dispatchCellEvent, assignCellVisibility } = useGridColDef();
    const gridApiRef = useRef<GridApi | null>(null);
    const columnApiRef = useRef<ColumnApi | null>(null);

    const gridReady = (params: GridReadyEvent) => {
        gridApiRef.current = params.api;
        columnApiRef.current = params.columnApi;
    };

    const onQuery = useCallback(() => {
        gridApiRef.current?.showLoadingOverlay();
        fetchHistoryStudy({ params: {} }).subscribe({
            next: (res) => {
                setRowData(res.data);
                gridApiRef.current?.deselectAll();
                gridApiRef.current?.hideOverlay();
            },
            error: () => {
                gridApiRef.current?.hideOverlay();
            },
        });
    }, [setRowData]);

    const onRapidQuery = useCallback(
        (days: number) => {
            const today = format(new Date(), 'yyyyMMdd');
            const pastDay = format(sub(new Date(), { days }), 'yyyyMMdd');
            gridApiRef.current?.showLoadingOverlay();
            fetchHistoryStudy({ params: { StudyDate: `${pastDay}-${today}` } }).subscribe({
                next: (res) => {
                    setRowData(res.data);
                    gridApiRef.current?.deselectAll();
                    gridApiRef.current?.hideOverlay();
                },
                error: () => {
                    gridApiRef.current?.hideOverlay();
                },
            });
        },
        [setRowData],
    );

    const onNavigateReport = useCallback(
        (data: StudyData) => {
            history.push({
                pathname: `/reporting/history/studyInstanceUID/${data.StudyInstanceUID}/version/${data.Version}`,
            });
        },
        [history],
    );

    const onRenderPDF = useCallback((gridApi: GridApi) => {
        const selectedRow = gridApi.getSelectedRows()[0] as StudyData;
        if (!selectedRow) {
            setPdfUrl('');
            return;
        }
        setPdfUrl(selectedRow.PDFFilePath);
    }, []);

    useEffect(() => {
        let mutateColDef: ColDef[] = [...define.historyStudy.colDef];
        mutateColDef = dispatchCellEvent(mutateColDef, 'navigateReport', onNavigateReport);
        mutateColDef = assignCellVisibility(mutateColDef, 'navigateReport', checkAvailable);
        setColDefs(mutateColDef);
    }, [assignCellVisibility, checkAvailable, dispatchCellEvent, onNavigateReport]);

    // Call api when row data is empty
    useEffect(() => {
        onQuery();
    }, [onQuery]);

    return (
        <Stack direction="column" spacing={1} className={classes.container}>
            <Stack direction="row" spacing={1} className={classes.rapidQuery}>
                <Button variant="contained" color="primary" onClick={() => onQuery()}>
                    All
                </Button>
                <Button variant="contained" color="primary" onClick={() => onRapidQuery(0)}>
                    Today
                </Button>
                <Button variant="contained" color="primary" onClick={() => onRapidQuery(7)}>
                    Week
                </Button>
                <Button variant="contained" color="primary" onClick={() => onRapidQuery(30)}>
                    Month
                </Button>
            </Stack>
            <div className={classes.result}>
                <div className={`${classes.tableContainer} ag-theme-modal-black-header`}>
                    <GridTable
                        checkboxSelect={false}
                        rowSelection="single"
                        columnDefs={colDefs}
                        rowData={rowData}
                        gridReady={gridReady}
                        onSelectionChanged={onRenderPDF}
                    />
                </div>
            </div>
        </Stack>
    );
}

export default observer(History);
