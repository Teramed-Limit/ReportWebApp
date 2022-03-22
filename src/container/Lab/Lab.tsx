import React from 'react';

import { ColDef } from 'ag-grid-community';
import { observer } from 'mobx-react';

import { fetchHISLabRequests } from '../../axios/api';
import GridContainer from '../../layout/GridContainer/GridContainer';
import { useStore } from '../../models/useStore';
import { formatDateTime, spiltDateTime } from '../../utils/general';

const colDef: ColDef[] = [
    { field: 'SpecimenNo', headerName: 'Specimen No', flex: 1 },
    { field: 'Discipline', headerName: 'Discipline', flex: 1 },
    { field: 'LabTestDesc', headerName: 'Lab Test Description', flex: 1 },
    { field: 'NoOfSample', headerName: 'No of Sample', flex: 1 },
    { field: 'SpecifiedLocation', headerName: 'Specified Location', flex: 1 },
    { field: 'Preparation', headerName: 'Preparation', flex: 1 },
    { field: 'Remarks', headerName: 'Remarks', flex: 1 },
    {
        field: 'RequestDate',
        headerName: 'Request Date Time',
        flex: 1,
        valueFormatter: (params) =>
            formatDateTime('YYYY-MM-DD HH:mm:ss', spiltDateTime(params.value)),
    },
];

const Lab = () => {
    const store = useStore();
    const { formData } = store.dataStore;

    return (
        <GridContainer
            columnDefs={colDef}
            id="HISLabRequestsDataset"
            fetch$={fetchHISLabRequests(formData.get('EpisodeNo'), formData.get('StaffCode'))}
        />
    );
};

export default observer(Lab);
