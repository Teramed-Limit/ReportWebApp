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

import {
    AttachmentData,
    DocumentData,
    ReportImageData,
    ReportStatus,
} from '../../interface/document-data';
import { FormControl, FormState } from '../../interface/form-state';
import { Notification, ReportResponseNotification } from '../../interface/notification';
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
    readonly imageData: ReportImageData[];
    readonly attachmentData: AttachmentData[];
    // Actions
    valueChanged: (id: string, value: any) => void;

    // 更新 array field 的值
    arrayValueChanged: (
        idx: number, // idx
        id: string, // field id
        targetId: string, // template field id
        value: any, // field value
        targetValue: any, // template field value
    ) => void;
    validate: (id: string, value: any) => FormControl;
    applyInitMappingReportData: () => void;
    initialFormControl: () => void;
    resetFormData: (formData: DocumentData) => any;
    resetFormState: (state: FormState) => any;
    unlockReport: (payload: string, cleanAll?: boolean) => void;
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
    saveTempReportData: () => void;
    fetchReport: (studyInstanceUID: string) => Promise<Notification>;
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
