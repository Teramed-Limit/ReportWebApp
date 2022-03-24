export const define = {
    study: {
        colDef: [
            {
                field: 'navigateReport',
                headerName: '',
                width: 45,
                cellStyle: { padding: 0 },
                cellRenderer: 'editRowRenderer',
                cellRendererParams: { onClick: () => {} },
            },
            {
                field: 'ReportExist',
                headerName: 'Status',
                width: 100,
                cellStyle: { padding: 0 },
                cellRenderer: 'reportStatusRenderer',
            },
            { field: 'PatientId', headerName: 'Patient Id', width: 160 },
            { field: 'PatientsName', headerName: 'Patient Name', width: 160 },
            { field: 'AccessionNumber', headerName: 'Accession No.', width: 180 },
            { field: 'PatientsBirthDate', headerName: 'BirthDate', width: 120 },
            { field: 'StudyDate', headerName: 'Study Date', width: 120 },
            { field: 'Modality', headerName: 'Modality', width: 120 },
            { field: 'StudyDescription', headerName: 'Description', flex: 1, minWidth: 200 },
            { field: 'StudyInstanceUID', headerName: 'StudyInstanceUID', hide: true, width: 120 },
        ],
    },
};

export const defaultQueryFields = ['PatientId', 'AccessionNumber', 'Modality', 'StudyDate'];
export const dbQueryField = [
    { id: 'PatientId', label: 'Patient ID', type: 'Text' },
    { id: 'PatientsName', label: 'Patient Name', type: 'Text' },
    { id: 'AccessionNumber', label: 'Accession No.', type: 'Text' },
    {
        id: 'Modality',
        label: 'Modality',
        type: 'SingleSelect',
        optionSource: { type: 'static', source: 'modality' },
    },
    { id: 'StudyDate', label: 'Study Date', type: 'DataRange' },
];
