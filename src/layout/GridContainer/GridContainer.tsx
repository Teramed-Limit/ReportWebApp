import React, { useContext } from 'react';

import { ColDef, GridApi } from 'ag-grid-community';
import { AxiosError, AxiosResponse } from 'axios';
import { observer } from 'mobx-react';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import GridTable from '../../components/GridTable/GridTable';
import Button from '../../components/UI/Button/Button';
import { NotificationContext } from '../../context/notification-context';
import { useStore } from '../../models/useStore';
import classes from './GridContainer.module.scss';

interface GridContainerProps {
    columnDefs: ColDef[];
    fetch$: Observable<AxiosResponse>;
    id: string;
}

const GridContainer = ({ columnDefs, fetch$, id }: GridContainerProps) => {
    const store = useStore();
    const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
    const { formData, valueChanged, reportDisabled } = store.dataStore;
    const rowData = formData.get(id);

    const onSelectionChanged = (gridApi: GridApi) => {
        gridApi.getModel().forEachNode((node, index) => {
            rowData[index].IsSelected = node.isSelected() ? '1' : '';
        });

        valueChanged(id, rowData.slice());
    };

    const onFirstDataRendered = (gridApi: GridApi) => {
        rowData.forEach((row, index) => {
            const rowNode = gridApi.getRowNode(String(index));
            return row.IsSelected === '1'
                ? rowNode?.selectThisNode(true)
                : rowNode?.selectThisNode(false);
        });
    };

    const reload = () => {
        fetch$.pipe(first()).subscribe(
            (res) => {
                valueChanged(id, res.data);
                setSuccessNotification('Reload Success');
            },
            (error: AxiosError) => {
                setErrorNotification(error.response?.data.Message || 'Error occurs');
            },
        );
    };

    return (
        <>
            <div className={`${classes[`table-toolbar`]} title`}>
                <Button
                    id={`gridContainer__btn-${id}`}
                    disabled={reportDisabled}
                    theme="primary"
                    onClick={reload}
                >
                    Reload
                </Button>
            </div>
            <div className={`ag-theme-alpine ${classes[`table-container`]}`}>
                <GridTable
                    disabled={reportDisabled}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onSelectionChanged={onSelectionChanged}
                    onFirstDataRendered={onFirstDataRendered}
                />
            </div>
        </>
    );
};

export default observer(GridContainer);
