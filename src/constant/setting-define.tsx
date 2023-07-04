import React from 'react';

import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ColDef, ValueFormatterParams } from 'ag-grid-community/dist/lib/entities/colDef';

import { dateFilterParams } from '../utils/ag-grid-utils';
import { convertToDate, convertToDateTime, stringFormatDate } from '../utils/general';
// eslint-disable react/react-in-jsx-scope
export const define = {
    study: {
        colDef: [
            {
                field: 'navigateReport',
                colId: 'navigation__report',
                headerName: '',
                width: 45,
                cellStyle: { padding: 0 },
                cellRenderer: 'iconButtonRenderer',
                cellRendererParams: {
                    onClick: () => {},
                    icon: <EditIcon />,
                },
                pinned: 'left',
            },
            {
                field: 'assignReport',
                colId: 'assign__report',
                headerName: '',
                width: 45,
                cellStyle: { padding: 0 },
                cellRenderer: 'iconButtonRenderer',
                cellRendererParams: {
                    onClick: () => {},
                    icon: <AssignmentIcon />,
                    color: '#2e7d32',
                },
                pinned: 'left',
            },
            {
                field: 'deleteReport',
                colId: 'delete__report',
                headerName: '',
                width: 45,
                cellStyle: { padding: 0 },
                cellRenderer: 'iconButtonRenderer',
                cellRendererParams: {
                    onClick: () => {},
                    icon: <DeleteIcon />,
                    color: 'rgba(255, 86, 48)',
                },
                pinned: 'left',
            },
            {
                field: 'ReportStatus',
                headerName: 'Status',
                width: 130,
                cellStyle: { padding: 0 },
                cellRenderer: 'statusRenderer',
                cellRendererParams: { Saved: 'warning', Signed: 'success', New: 'error' },
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
                field: 'ReferringPhysiciansName',
                headerName: 'Referring Physician',
                flex: 1,
                width: 200,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
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
        ] as ColDef[],
    },
    historyStudy: {
        colDef: [
            {
                field: 'navigateReport',
                headerName: '',
                width: 45,
                cellStyle: { padding: 0 },
                cellRenderer: 'iconButtonRenderer',
                cellRendererParams: {
                    onClick: () => {},
                    icon: <VisibilityIcon />,
                },
                pinned: 'left',
            },
            {
                field: 'ReportStatus',
                headerName: 'Status',
                width: 130,
                cellStyle: { padding: 0 },
                cellRenderer: 'statusRenderer',
                cellRendererParams: { Saved: 'warning', Signed: 'success', New: 'error' },
                pinned: 'left',
                filter: 'agTextColumnFilter',
                floatingFilter: true,
            },
            {
                field: 'Version',
                headerName: 'Num of version',
                width: 150,
                pinned: 'left',
            },
            {
                field: 'Author',
                headerName: 'Last modified by',
                width: 170,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
                pinned: 'left',
            },
            {
                field: 'DateTime',
                headerName: 'Last modified',
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
        ] as ColDef[],
    },
    loginStatus: {
        colDef: [
            {
                field: 'userId',
                headerName: 'UserId',
                width: 180,
            },
            {
                field: 'expireAt',
                headerName: 'Expire At',
                width: 180,
                valueFormatter: (params: ValueFormatterParams) => {
                    return convertToDateTime(params.value);
                },
            },
            {
                field: 'created',
                headerName: 'Created',
                width: 180,
                valueFormatter: (params: ValueFormatterParams) => {
                    return convertToDateTime(params.value);
                },
            },
            {
                field: 'createdByIp',
                headerName: 'Created By Ip',
                width: 180,
            },
            {
                field: 'logoutUser',
                headerName: '',
                width: 100,
                cellStyle: { padding: 0 },
                cellRenderer: 'buttonRenderer',
                cellRendererParams: {
                    label: 'Logout',
                    color: 'error',
                    variant: 'contained',
                    onClick: () => {},
                },
            },
        ] as ColDef[],
    },
    userRoleGroup: {
        colDef: [
            { field: 'RoleName', headerName: 'Role Name', width: 200 },
            { field: 'Description', headerName: 'Description', width: 200 },
        ] as ColDef[],
        formDef: {
            sections: [
                {
                    id: 'form',
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
                width: 150,
            },
            {
                field: 'DoctorEName',
                headerName: 'User Name',
                width: 250,
            },
            {
                field: 'Title',
                headerName: 'Title',
                width: 100,
            },
            {
                field: 'JobTitle',
                headerName: 'Job Title',
                width: 200,
            },
            {
                field: 'SignatureUrl',
                headerName: 'Signature',
                width: 120,
                cellRenderer: 'imageRowRenderer',
            },
            {
                field: 'Summary',
                headerName: 'Summary',
                width: 300,
            },
            {
                field: 'UserGroupList',
                headerName: 'User Group',
                minWidth: 300,
                cellRenderer: 'chipRenderer',
                flex: 1,
            },
            {
                field: 'RoleList',
                headerName: 'Role Group',
                minWidth: 300,
                cellRenderer: 'chipRenderer',
                flex: 1,
            },
        ] as ColDef[],
        formDef: {
            sections: [
                {
                    id: 'form',
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
                        {
                            id: 'DoctorEName',
                            label: 'User Name',
                            type: 'Text',
                            validate: { type: 'Required' },
                        },
                        {
                            id: 'Title',
                            label: 'Title',
                            type: 'Text',
                        },
                        {
                            id: 'JobTitle',
                            label: 'Job Title',
                            type: 'Text',
                        },
                        {
                            id: 'Summary',
                            label: 'Summary',
                            type: 'Text',
                        },
                        { id: 'SignatureUrl', label: 'Signature', type: 'ImageSelect' },
                        {
                            id: 'UserGroupList',
                            label: 'User Group',
                            type: 'MultiSelect',
                            optionSource: {
                                type: 'http',
                                source: 'usergroup',
                                key: 'Name',
                                labelKey: 'Name',
                            },
                        },
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
    filterField: {
        colDef: [
            { field: 'Name', headerName: 'Name', width: 200 },
            { field: 'Description', headerName: 'Description', width: 200, flex: 1 },
        ] as ColDef[],
        formDef: {
            sections: [
                {
                    id: 'form',
                    fields: [
                        {
                            id: 'Name',
                            label: 'Name',
                            type: 'Text',
                            isKey: true,
                            validate: { type: 'Required' },
                        },
                        {
                            id: 'Description',
                            label: 'Description',
                            type: 'Text',
                        },
                    ],
                },
            ],
        },
    },
    filterFieldRule: {
        colDef: [
            { field: 'Field', headerName: 'Field', width: 200 },
            { field: 'Operator', headerName: 'Operator', width: 200 },
            { field: 'AndOr', headerName: 'AndOr', width: 200 },
            {
                field: 'BundleConditionStart',
                headerName: 'Bundle Condition Start',
                cellRenderer: 'checkboxRenderer',
                width: 200,
            },
            {
                field: 'BundleConditionEnd',
                headerName: 'Bundle Condition End',
                cellRenderer: 'checkboxRenderer',
                width: 200,
            },
            { field: 'Value', headerName: 'Value', width: 200 },
            { field: 'FieldFilterName', headerName: 'FieldFilterName', width: 200, hide: true },
            { field: 'Id', headerName: 'Id', width: 200, hide: true },
        ] as ColDef[],
        formDef: {
            sections: [
                {
                    id: 'form',
                    fields: [
                        {
                            id: 'Field',
                            label: 'Field',
                            type: 'SingleSelect',
                            validate: { type: 'Required' },
                            optionSource: {
                                type: 'static',
                                source: 'FilterField',
                                key: 'Value',
                                labelKey: 'Label',
                            },
                        },
                        {
                            id: 'Operator',
                            label: 'Operator',
                            type: 'SingleSelect',
                            validate: { type: 'Required' },
                            optionSource: {
                                type: 'static',
                                source: 'FilterRuleOperator',
                                key: 'Value',
                                labelKey: 'Label',
                            },
                        },
                        {
                            id: 'AndOr',
                            label: 'And/Or',
                            type: 'SingleSelect',
                            validate: { type: 'Required' },
                            optionSource: {
                                type: 'static',
                                source: 'FilterRuleAndOr',
                                key: 'Value',
                                labelKey: 'Label',
                            },
                        },
                        {
                            id: 'BundleConditionStart',
                            label: 'Bundle Condition Start',
                            type: 'Checkbox',
                        },
                        {
                            id: 'BundleConditionEnd',
                            label: 'Bundle Condition End',
                            type: 'Checkbox',
                        },
                        {
                            id: 'Value',
                            label: 'Value',
                            type: 'Text',
                        },
                        {
                            id: 'FieldFilterName',
                            label: 'Field Filter',
                            type: 'Text',
                            hide: true,
                            validate: { type: 'Required' },
                        },
                    ],
                },
            ],
        },
    },
    userGroup: {
        colDef: [
            { field: 'Name', headerName: 'Name', width: 200 },
            { field: 'Description', headerName: 'Description', width: 200 },
            {
                field: 'AccessAllStudies',
                headerName: 'Access All Studies',
                cellRenderer: 'checkboxRenderer',
                width: 200,
            },
            {
                field: 'Level',
                headerName: 'Level',
                width: 200,
            },
            { field: 'Department', headerName: 'Department', width: 200 },
        ] as ColDef[],
        formDef: {
            sections: [
                {
                    id: 'form',
                    fields: [
                        {
                            id: 'Name',
                            label: 'Name',
                            type: 'Text',
                            validate: { type: 'Required' },
                            isKey: true,
                        },
                        {
                            id: 'Description',
                            label: 'Description',
                            type: 'Text',
                        },
                        {
                            id: 'AccessAllStudies',
                            label: 'AccessAllStudies',
                            type: 'Checkbox',
                        },
                        {
                            id: 'Level',
                            label: 'Level',
                            type: 'Number',
                            validate: { type: 'Required' },
                        },
                        {
                            id: 'Department',
                            label: 'Department',
                            type: 'Text',
                            validate: { type: 'Required' },
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
        ] as ColDef[],
        formDef: {
            sections: [
                {
                    id: 'form',
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
