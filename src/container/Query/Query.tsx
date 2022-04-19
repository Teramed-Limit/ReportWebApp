import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
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
import classes from './Query.module.scss';

const Query: React.FC = () => {
    const history = useHistory();
    const { fetchReport } = useReportDataStore();
    const { onConditionChanged, onResultChanged, queryResult, queryPairData } = useQueryStore();
    const { showNotifyMsg } = useContext(NotificationContext);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
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

            <div className={`${classes.tableContainer} ag-theme-modal-black-header`}>
                <GridTable
                    checkboxSelect={false}
                    rowSelection="single"
                    columnDefs={colDefs}
                    rowData={queryResult}
                    gridReady={gridReady}
                />
            </div>
        </div>
    );
};

export default observer(Query);
