import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton, Paper, Typography } from '@mui/material';
import { ColDef, ColumnApi } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { observer } from 'mobx-react';
import { concatMap } from 'rxjs/operators';

import classes from './LoginStatus.module.scss';
import { fetchLoginStatus, logoutSpecifyUser } from '../../axios/api';
import GridTable from '../../components/GridTable/GridTable';
import { define } from '../../constant/setting-define';
import { NotificationContext } from '../../context/notification-context';
import { useGridColDef } from '../../hooks/useGridColDef';
import { LoginStatusData } from '../../interface/login-status';
import { MessageType } from '../../interface/notification';

function LoginStatus() {
    const { openNotification: setNotification } = useContext(NotificationContext);
    const [rowData, setRowData] = useState<LoginStatusData[]>([]);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    // dispatch event for cell event
    const { dispatchCellEvent, assignCellVisibility } = useGridColDef();

    const gridApiRef = useRef<GridApi | null>(null);
    const columnApiRef = useRef<ColumnApi | null>(null);

    const gridReady = (params: GridReadyEvent) => {
        gridApiRef.current = params.api;
        columnApiRef.current = params.columnApi;
    };

    const onQuery = useCallback(() => {
        const subscription = fetchLoginStatus().subscribe({
            next: (res) => setRowData(res.data),
            error: (err) => {
                setNotification(MessageType.Error, err.response?.data.Message || err.message);
            },
        });
        return () => subscription?.unsubscribe();
    }, [setNotification, setRowData]);

    const onLogoutUser = useCallback(
        (data: LoginStatusData) => {
            logoutSpecifyUser(data.userId)
                .pipe(concatMap(() => fetchLoginStatus()))
                .subscribe((res) => setRowData(res.data));
        },
        [setRowData],
    );

    useEffect(() => {
        let mutateColDef: ColDef[] = [...define.loginStatus.colDef];
        mutateColDef = dispatchCellEvent(mutateColDef, 'logoutUser', onLogoutUser);
        setColDefs(mutateColDef);
        onQuery();
    }, [assignCellVisibility, dispatchCellEvent, onLogoutUser, onQuery]);

    return (
        <Paper elevation={3} className={classes.container}>
            <Typography variant="h5" gutterBottom component="div" className={classes.sectionHeader}>
                Logging Status
                <IconButton color="primary" component="span" onClick={() => onQuery()}>
                    <RefreshIcon />
                </IconButton>
            </Typography>
            <div className={`${classes.tableContainer} ag-theme-modal-black-header`}>
                <GridTable
                    checkboxSelect={false}
                    rowSelection="single"
                    columnDefs={colDefs}
                    rowData={rowData || []}
                    gridReady={gridReady}
                />
            </div>
        </Paper>
    );
}

export default observer(LoginStatus);
