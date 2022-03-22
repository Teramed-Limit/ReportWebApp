import React from 'react';

import { ColDef } from 'ag-grid-community';
import { observer } from 'mobx-react';

import { fetchHISConsumable } from '../../axios/api';
import GridContainer from '../../layout/GridContainer/GridContainer';
import { useStore } from '../../models/useStore';
import { formatDateTime, spiltDateTime } from '../../utils/general';

const colDef: ColDef[] = [
    { field: 'ItemName', headerName: 'Name', flex: 1, resizable: true },
    { field: 'ItemUnitName', headerName: 'Unit Name', flex: 1, resizable: true },
    { field: 'Quantity', headerName: 'Quantity used', flex: 1, resizable: true },
    {
        field: 'EntryDateTime',
        headerName: 'Entry Date Time',
        flex: 1,
        resizable: true,
        valueFormatter: (params) =>
            formatDateTime('YYYY-MM-DD HH:mm:ss', spiltDateTime(params.value)),
    },
];

const Consumable = () => {
    const store = useStore();
    const { formData } = store.dataStore;

    return (
        <GridContainer
            columnDefs={colDef}
            id="HISConsumableDataset"
            fetch$={fetchHISConsumable(formData.get('EpisodeNo'), formData.get('Dept'))}
        />
    );
};

export default observer(Consumable);
