import { ColDef } from 'ag-grid-community';

export const LogColDef: ColDef[] = [
    {
        field: 'StudyDescription',
        headerName: 'Study Desc.',
        width: 190,
        flex: 2,
        tooltipField: 'StudyDescription',
    },
    { field: 'CreateDateTime', headerName: 'Create Time', width: 190, flex: 2 },
    { field: 'ModifiedDateTime', headerName: 'Modified Time', width: 190, flex: 2 },
    { field: 'SignOffsDateTime', headerName: 'SignOffs Time', width: 190, flex: 2 },
    { field: 'PDFFilePath', headerName: 'PDF', width: 50, flex: 1, cellRenderer: 'file' },
    { field: 'END001_Status', headerName: 'END001', width: 50, flex: 1, cellRenderer: 'icon' },
    { field: 'END002_Status', headerName: 'END002', width: 50, flex: 1, cellRenderer: 'icon' },
    { field: 'END003_Status', headerName: 'END003', width: 50, flex: 1, cellRenderer: 'icon' },
    { field: 'END004_Status', headerName: 'END004', width: 50, flex: 1, cellRenderer: 'icon' },
    { field: 'END005_Status', headerName: 'END005', width: 50, flex: 1, cellRenderer: 'icon' },
    { field: 'StudyInstanceUID', hide: true },
    { field: 'Author', hide: true },
];
