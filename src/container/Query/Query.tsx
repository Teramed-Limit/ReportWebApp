import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Button, Stack } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { format, sub } from 'date-fns';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import { fetchStudy } from '../../axios/api';
import ConditionQuerier from '../../components/ConditonQuerier/ConditionQuerier';
import GridTable from '../../components/GridTable/GridTable';
import { dbQueryField, defaultQueryFields, define } from '../../constant/setting-define';
import { NotificationContext } from '../../context/notification-context';
import { useGridColDef } from '../../hooks/useGridColDef';
import { StudyData } from '../../interface/study-data';
import { useQueryStore, useReportDataStore } from '../../models/useStore';
import { generateUUID, isEmptyOrNil } from '../../utils/general';
import classes from './Query.module.scss';

const Query: React.FC = () => {
    const history = useHistory();
    const { fetchReport } = useReportDataStore();
    const { onConditionChanged, onResultChanged, queryResult, queryPairData } = useQueryStore();
    const { showNotifyMsg } = useContext(NotificationContext);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string>('');
    // dispatch event for cell event
    const { dispatchCellEvent } = useGridColDef();
    const gridApiRef = useRef<GridApi | null>(null);

    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onValueChanged = (value: any, fieldId: string) => {
        onConditionChanged(value, fieldId);
    };

    const onQuery = useCallback(() => {
        gridApiRef.current?.showLoadingOverlay();
        fetchStudy({ params: { ...queryPairData } }).subscribe({
            next: (res) => {
                onResultChanged(res.data);
                gridApiRef.current?.deselectAll();
                gridApiRef.current?.hideOverlay();
            },
            error: () => {
                gridApiRef.current?.hideOverlay();
            },
        });
    }, [onResultChanged, queryPairData]);

    const onRapidQuery = useCallback(
        (days: number) => {
            const today = format(new Date(), 'yyyyMMdd');
            const pastDay = format(sub(new Date(), { days }), 'yyyyMMdd');
            gridApiRef.current?.showLoadingOverlay();
            fetchStudy({ params: { StudyDate: `${pastDay}-${today}` } }).subscribe({
                next: (res) => {
                    onResultChanged(res.data);
                    gridApiRef.current?.deselectAll();
                    gridApiRef.current?.hideOverlay();
                },
                error: () => {
                    gridApiRef.current?.hideOverlay();
                },
            });
        },
        [onResultChanged],
    );

    const onNavigateReport = useCallback(
        (data: StudyData) => {
            fetchReport(data, (signal$) =>
                signal$.pipe(
                    tap(({ notification }) => {
                        showNotifyMsg(notification);
                        history.push({ pathname: `/reporting` });
                    }),
                ),
            );
        },
        [fetchReport, history, showNotifyMsg],
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
        let mutateColDef: ColDef[] = [...define.study.colDef];
        mutateColDef = dispatchCellEvent(mutateColDef, 'navigateReport', onNavigateReport);
        setColDefs(mutateColDef);
    }, [dispatchCellEvent, onNavigateReport]);

    return (
        <div className={classes.container}>
            <ConditionQuerier
                fields={dbQueryField}
                defaultQueryFields={defaultQueryFields}
                queryPairData={queryPairData}
                onQuery={onQuery}
                onQueryPairDataChanged={onValueChanged}
            />
            <Stack direction="row" spacing={1} className={classes.rapidQuery}>
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
                        rowData={queryResult}
                        gridReady={gridReady}
                        onSelectionChanged={onRenderPDF}
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
        </div>
    );
};

export default observer(Query);
