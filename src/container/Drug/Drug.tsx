import React from 'react';

import { ColDef } from 'ag-grid-community';
import { observer } from 'mobx-react';

import { fetchHISMedication } from '../../axios/api';
import GridContainer from '../../layout/GridContainer/GridContainer';
import { useStore } from '../../models/useStore';
import { formatDateTime, spiltDateTime } from '../../utils/general';

const colDef: ColDef[] = [
    { field: 'MedicationName', headerName: 'Name', flex: 1 },
    { field: 'MedicationRoute', headerName: 'Route', flex: 1 },
    { field: 'MedicationDose', headerName: 'Dose', flex: 1 },
    {
        field: 'MedicationPrescribeDate',
        headerName: 'Prescribe Data Time',
        flex: 1,
        valueFormatter: (params) =>
            formatDateTime('YYYY-MM-DD HH:mm:ss', spiltDateTime(params.value)),
    },
    {
        field: 'MedicationAdminDateTime',
        headerName: 'Admin Data Time',
        flex: 1,
        valueFormatter: (params) =>
            formatDateTime('YYYY-MM-DD HH:mm:ss', spiltDateTime(params.value)),
    },
];

const Drug = () => {
    const store = useStore();
    const { formData } = store.dataStore;

    return (
        <GridContainer
            columnDefs={colDef}
            id="HISMedicationDataset"
            fetch$={fetchHISMedication(formData.get('EpisodeNo'), formData.get('StaffCode'))}
        />
    );
};

export default observer(Drug);
