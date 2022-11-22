import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Chip, ChipPropsColorOverrides, Radio, Stack } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { ColDef, ColumnApi, IFilter } from 'ag-grid-community';
import { FilterChangedEvent, GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { format, sub } from 'date-fns';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import {
    queryFilterModel,
    queryReportStatus,
    queryRowDataState,
} from '../../atom/query-row-data-state';
import { fetchStudy } from '../../axios/api';
import GridTable from '../../components/GridTable/GridTable';
import { define } from '../../constant/setting-define';
import { useGridColDef } from '../../hooks/useGridColDef';
import { useRoleFunctionAvailable } from '../../hooks/useRoleFunctionAvailable';
import { StudyData } from '../../interface/study-data';
import { generateUUID, isEmptyOrNil } from '../../utils/general';
import classes from './Query.module.scss';

const Query: React.FC = () => {
    const history = useHistory();
    const [rowData, setRowData] = useRecoilState(queryRowDataState);
    const [filterModel, setFilterModel] = useRecoilState(queryFilterModel);
    const [filterBurnStatus, setFilterBurnStatus] = useRecoilState(queryReportStatus);
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
        gridApiRef.current?.setFilterModel(filterModel);
    };

    const filterByReportStatus = useCallback(
        (reportStatus: string) => {
            setFilterBurnStatus(reportStatus);
            if (gridApiRef.current == null || columnApiRef.current == null) return;

            const filterComponent = gridApiRef.current.getFilterInstance('ReportStatus') as IFilter;

            if (!filterComponent) return;

            if (reportStatus === 'All') filterComponent.setModel({});
            else filterComponent.setModel({ type: 'equals', filter: reportStatus });
            gridApiRef.current.onFilterChanged();
        },
        [setFilterBurnStatus],
    );

    const onQuery = useCallback(() => {
        gridApiRef.current?.showLoadingOverlay();
        fetchStudy({ params: {} }).subscribe({
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
            fetchStudy({ params: { StudyDate: `${pastDay}-${today}` } }).subscribe({
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
                pathname: `/reporting/studyInstanceUID/${data.StudyInstanceUID}`,
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

    const radioComp = (
        value: string,
        color: OverridableStringUnion<
            'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
            ChipPropsColorOverrides
        >,
    ) => {
        return (
            <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Radio
                    checked={filterBurnStatus === value}
                    onChange={() => filterByReportStatus(value)}
                    value={value}
                />
                <Chip
                    sx={{ fontSize: '12px', height: '20px', fontWeight: 700 }}
                    color={color}
                    label={value}
                    onClick={() => filterByReportStatus(value)}
                />
            </Stack>
        );
    };

    const onFilterChanged = (event: FilterChangedEvent) => {
        setFilterModel(event.api.getFilterModel());
    };

    useEffect(() => {
        let mutateColDef: ColDef[] = [...define.study.colDef];
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
            <Stack direction="row" sx={{ alignItems: 'center' }}>
                {radioComp('All', 'primary')}
                {radioComp('Incomplete', 'error')}
                {radioComp('Saved', 'warning')}
                {radioComp('Signed', 'success')}
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
                        onFilterChanged={onFilterChanged}
                    />
                </div>
                {!isEmptyOrNil(pdfUrl) && (
                    <iframe
                        className={classes.pdfPreview}
                        id="pdfPreview"
                        title="pdfPreview"
                        src={`${pdfUrl}?a=${generateUUID()}`}
                    />
                )}
            </div>
        </Stack>
    );
};

export default observer(Query);
