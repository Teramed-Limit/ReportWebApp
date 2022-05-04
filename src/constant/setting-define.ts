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
                width: 130,
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
            { field: 'StudyInstanceUID', headerName: 'StudyInstanceUID', hide: true },
            { field: 'PDFFilePath', headerName: 'PDFFilePath', hide: true },
        ],
    },
    userRoleGroup: {
        colDef: [
            { field: 'RoleName', headerName: 'Role Name', width: 200 },
            { field: 'Description', headerName: 'Description', width: 200 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        {
                            id: 'RoleName',
                            label: 'Role Name',
                            type: 'Text',
                            readOnly: true,
                            validate: { type: 'Required' },
                        },
                        { id: 'Description', label: 'Description', type: 'Text' },
                    ],
                },
            ],
        },
    },
    userAccount: {
        colDef: [
            {
                field: 'UserID',
                headerName: 'User Id',
                width: 200,
            },
            {
                field: 'UserPassword',
                headerName: 'Password',
                width: 200,
            },
            {
                field: 'DoctorCName',
                headerName: 'Doctor CName',
                width: 200,
            },
            {
                field: 'DoctorEName',
                headerName: 'Doctor EName',
                width: 200,
            },
            {
                field: 'RoleList',
                headerName: 'Role Group',
                width: 200,
                cellRenderer: 'chipRenderer',
                flex: 1,
            },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        {
                            id: 'UserID',
                            label: 'User Id',
                            type: 'Text',
                            readOnly: true,
                            validate: { type: 'Required' },
                        },
                        {
                            id: 'UserPassword',
                            label: 'Password',
                            type: 'Text',
                            validate: { type: 'Required' },
                        },
                        { id: 'DoctorCName', label: 'User CName', type: 'Text' },
                        { id: 'DoctorEName', label: 'User EName', type: 'Text' },
                        {
                            id: 'RoleList',
                            label: 'Role Group',
                            type: 'MultiSelect',
                            optionSource: {
                                type: 'http',
                                source: 'role',
                                key: 'RoleName',
                                labelKey: 'RoleName',
                            },
                        },
                    ],
                },
            ],
        },
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
        optionSource: { type: 'static', source: 'Modality' },
    },
    { id: 'StudyDate', label: 'Study Date', type: 'DataRange' },
];
