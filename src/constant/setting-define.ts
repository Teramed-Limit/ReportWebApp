import { ValueFormatterParams } from 'ag-grid-community/dist/lib/entities/colDef';

import { dateFilterParams } from '../utils/ag-grid-utils';
import { convertToDate, convertToDateTime, stringFormatDate } from '../utils/general';

export const define = {
    study: {
        colDef: [
            {
                field: 'navigateReport',
                colId: 'navigation__report',
                headerName: '',
                width: 45,
                cellStyle: { padding: 0 },
                cellRenderer: 'editRowRenderer',
                cellRendererParams: {
                    onClick: () => {},
                },
                pinned: 'left',
            },
            {
                field: 'ReportStatus',
                headerName: 'Status',
                width: 130,
                cellStyle: { padding: 0 },
                cellRenderer: 'statusRenderer',
                cellRendererParams: { Saved: 'warning', Signed: 'success', InComplete: 'error' },
                pinned: 'left',
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'Author',
                headerName: 'Author',
                width: 120,
                pinned: 'left',
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'PatientId',
                headerName: 'Patient Id',
                width: 160,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'PatientsName',
                headerName: 'Patient Name',
                width: 160,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'AccessionNumber',
                headerName: 'Accession No.',
                width: 180,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'PatientsBirthDate',
                headerName: 'BirthDate',
                width: 160,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                floatingFilter: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    const date = stringFormatDate(params.value, 'yyyyMMdd');
                    return convertToDate(date);
                },
            },
            {
                field: 'StudyDate',
                headerName: 'Study Date',
                width: 160,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                floatingFilter: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    const date = stringFormatDate(params.value, 'yyyyMMdd');
                    return convertToDate(date);
                },
            },
            {
                field: 'Modality',
                headerName: 'Modality',
                width: 120,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'StudyDescription',
                headerName: 'Description',
                flex: 1,
                minWidth: 200,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            { field: 'StudyInstanceUID', headerName: 'StudyInstanceUID', hide: true },
            { field: 'PDFFilePath', headerName: 'PDFFilePath', hide: true },
        ],
    },
    historyStudy: {
        colDef: [
            {
                field: 'navigateReport',
                colId: 'navigation__report',
                headerName: '',
                width: 45,
                cellStyle: { padding: 0 },
                cellRenderer: 'editRowRenderer',
                cellRendererParams: {
                    onClick: () => {},
                },
                pinned: 'left',
            },
            {
                field: 'ReportStatus',
                headerName: 'Status',
                width: 130,
                cellStyle: { padding: 0 },
                cellRenderer: 'statusRenderer',
                cellRendererParams: { Saved: 'warning', Signed: 'success', InComplete: 'error' },
                pinned: 'left',
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'Version',
                headerName: 'Version',
                width: 100,
                pinned: 'left',
            },
            {
                field: 'Author',
                headerName: 'Author',
                width: 120,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
                pinned: 'left',
            },
            {
                field: 'DateTime',
                headerName: 'Date',
                width: 180,
                pinned: 'left',
                valueFormatter: (params: ValueFormatterParams) => {
                    return convertToDateTime(params.value);
                },
            },
            {
                field: 'PatientId',
                headerName: 'Patient Id',
                width: 160,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'PatientsName',
                headerName: 'Patient Name',
                width: 160,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'AccessionNumber',
                headerName: 'Accession No.',
                width: 180,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'PatientsBirthDate',
                headerName: 'BirthDate',
                width: 160,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                floatingFilter: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    const date = stringFormatDate(params.value, 'yyyyMMdd');
                    return convertToDate(date);
                },
            },
            {
                field: 'StudyDate',
                headerName: 'Study Date',
                width: 160,
                filter: 'agDateColumnFilter',
                filterParams: dateFilterParams,
                floatingFilter: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    const date = stringFormatDate(params.value, 'yyyyMMdd');
                    return convertToDate(date);
                },
            },
            {
                field: 'Modality',
                headerName: 'Modality',
                width: 120,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'StudyDescription',
                headerName: 'Description',
                flex: 1,
                minWidth: 200,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
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
                            isKey: true,
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
                field: 'SignatureBase64',
                headerName: 'Signature',
                width: 120,
                cellRenderer: 'imageRowRenderer',
                cellRendererParams: { type: 'base64' },
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
                            isKey: true,
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
                        { id: 'SignatureBase64', label: 'Signature', type: 'ImageSelect' },
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
    codeList: {
        colDef: [
            {
                field: 'Id',
                width: 200,
                hide: true,
            },
            {
                field: 'Label',
                headerName: 'Label',
                width: 200,
                flex: 1,
            },
            {
                field: 'Value',
                headerName: 'Value',
                width: 200,
                flex: 1,
            },
            {
                field: 'CodeName',
                headerName: 'Code Name',
                width: 120,
            },
            {
                field: 'ParentCodeValue',
                headerName: 'Parent Code Value',
                width: 120,
            },
            {
                field: 'OrderingIndex',
                headerName: 'Ordering',
                minWidth: 120,
            },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        { id: 'Id', label: 'Id', type: 'Number', hide: true, isKey: true },
                        {
                            id: 'Label',
                            label: 'Label',
                            type: 'Text',
                            validate: { type: 'Required' },
                        },
                        {
                            id: 'Value',
                            label: 'Value',
                            type: 'Text',
                            validate: { type: 'Required' },
                        },
                        {
                            id: 'CodeName',
                            label: 'Code Name',
                            type: 'Text',
                            readOnly: true,
                            validate: { type: 'Required' },
                        },
                        { id: 'ParentCodeValue', label: 'Parent Code Value', type: 'Text' },
                        {
                            id: 'OrderingIndex',
                            label: 'Ordering',
                            type: 'Number',
                            validate: { type: 'Required' },
                        },
                    ],
                },
            ],
        },
    },
};
