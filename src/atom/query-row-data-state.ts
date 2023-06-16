import { atom } from 'recoil';

export const queryRowDataState = atom<any[]>({
    key: 'queryRowDataState',
    default: [],
});

export const queryReportStatus = atom<string>({
    key: 'queryReportStatus',
    default: 'All',
});

export const queryFilterModel = atom<{ [key: string]: any }>({
    key: 'queryFilterModel',
    default: {},
});

export const queryFilterDate = atom<number>({
    key: 'queryFilterDate',
    default: 0,
});
