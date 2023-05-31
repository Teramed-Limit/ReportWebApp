import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import {
    IAnyType,
    IMapType,
    IModelType,
    Instance,
    IOptionalIType,
    ISimpleType,
    IType,
} from 'mst-effect';
import { Observable } from 'rxjs';

import { DocumentData, ReportStatus } from '../../interface/document-data';
import { FormControl, FormState } from '../../interface/form-state';
import { ReportResponseNotification } from '../../interface/notification';
import { ReportValidation } from '../../interface/report-validation';

interface ReportDataTypeOfModal extends ModelProperties {
    lockByUser: IOptionalIType<ISimpleType<string>, [undefined]>;
    modifiable: IOptionalIType<ISimpleType<boolean>, [undefined]>;
    reportHasChanged: IOptionalIType<ISimpleType<boolean>, [undefined]>;
    loading: IOptionalIType<ISimpleType<boolean>, [undefined]>;
    formData: IMapType<IAnyType>;
    formState: IMapType<IAnyType>;
    formValidation: IOptionalIType<
        IType<ReportValidation, ReportValidation, ReportValidation>,
        [undefined]
    >;
}

interface ReportDataTypeOfActions {
    readonly pdfFile: undefined | string;
    readonly diagramMarkers: any;
    readonly diagramData: any | undefined;
    readonly findings: any | undefined;
    readonly reportStatus: ReportStatus;
    readonly studyInsUID: any | undefined;
    readonly reportTemplate: any | undefined;
    // Actions
    valueChanged: (id: string, value: any) => void;
    validate: (id: string, value: any) => FormControl;
    initialFormControl: () => void;
    cleanupAllReportState: () => void;
    resetFormData: (formData: DocumentData) => any;
    resetFormState: (state: FormState) => any;
    unlockReport: (payload: string) => void;
    lockReport: (payload: string) => void;
    signOffReport: <T = ReportResponseNotification>(
        payload: null,
        handler?: (result$: Observable<ReportResponseNotification>) => Observable<T>,
    ) => Promise<T | undefined>;
    saveReport: <T = ReportResponseNotification>(
        payload: null,
        handler?: (result$: Observable<ReportResponseNotification>) => Observable<T>,
    ) => Promise<T | undefined>;
    fetchReportLockStatus: <T = string>(
        payload: string,
        handler?: (result$: Observable<string>) => Observable<T>,
    ) => Promise<T | undefined>;
    autoSaveToLocalStorage: () => void;
    fetchReport: <T = ReportResponseNotification>(
        payload: string,
        handler?: (result$: Observable<ReportResponseNotification>) => Observable<T>,
    ) => Promise<T | undefined>;
    fetchHistoryReport: <T = ReportResponseNotification>(
        payload: {
            studyInstanceUID: string;
            version: string;
        },
        handler?: (result$: Observable<ReportResponseNotification>) => Observable<T>,
    ) => Promise<T | undefined>;
}

export type ReportDataTypeOfModel = ReportDataTypeOfModal & ReportDataTypeOfActions;

export type ReportDataModal = IModelType<ReportDataTypeOfModal, ReportDataTypeOfActions, any, any>;

export type DataStore = Instance<ReportDataModal>;
