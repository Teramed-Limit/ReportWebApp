import { AxiosError, AxiosResponse } from 'axios';
import { action, dollEffect, effect, getEnv, getRoot, IAnyModelType, types } from 'mst-effect';
import { iif, Observable, of, throwError } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { ImageTypeOfModel } from './model-type/image-type-modal';
import { ReportDataModal } from './model-type/report-data-type-modal';
import { ReportDefineTypeOfModel } from './model-type/report-define-type-modal';
import {
    fetchHistoryReport,
    fetchReport,
    getReportLockStatus,
    lockReport,
    saveReport,
    unlockReport,
} from '../axios/api';
import { LoginResult } from '../interface/auth';
import { DocumentData, ReportStatus } from '../interface/document-data';
import { FormControl, FormState } from '../interface/form-state';
import { MessageType, ReportResponseNotification } from '../interface/notification';
import { ReportValidation } from '../interface/report-validation';
import { RootService } from '../interface/root-service';
import LocalStorageService from '../service/local-storage-service';
import { isEmptyOrNil } from '../utils/general';

const dateModel = types.union(types.frozen<DocumentData>());
const formState = types.union(types.frozen<FormState>());

const formInvalidError = {
    response: { data: { Message: 'Required fields are not filled.' } },
};

export const DataModel: ReportDataModal = types
    .model('report', {
        lockByUser: types.optional(types.string, ''),
        modifiable: types.optional(types.boolean, false),
        // report data is latest, no edit
        reportHasChanged: types.optional(types.boolean, false),
        loading: types.optional(types.boolean, false),
        formData: types.map(dateModel),
        formState: types.map(formState),
        formValidation: types.optional(types.frozen<ReportValidation>(), {
            isValid: true,
            openModalName: '',
        }),
    })
    /* eslint-disable no-param-reassign */
    .views((self) => {
        return {
            get pdfFile() {
                if (isEmptyOrNil(self.formData.get('PDFFilePath'))) {
                    return undefined;
                }

                return `${self.formData.get('PDFFilePath')}`;
            },
            get reportStatus(): ReportStatus {
                return `${self.formData.get('ReportStatus')}` as ReportStatus;
            },
            get reportTemplate() {
                return self.formData.get('ReportTemplate');
            },
            get findings() {
                return self.formData.get('Findings');
            },
            get studyInsUID() {
                return self.formData.get('StudyInstanceUID');
            },
            get diagramData() {
                return self.formData.get('DiagramData');
            },
            get diagramMarkers() {
                return self.formData.get('DiagramMarkers') || [];
            },
            get imageData() {
                return self.formData.get('ReportImageData') || [];
            },
        };
    })
    .actions((self) => {
        const { reportDataService, reportDefineService, validationService } =
            getEnv<RootService>(self);

        const changeValue = (
            targetId: string,
            targetValue: any,
            staticState: Partial<FormControl> = {},
        ) => {
            const {
                defineStore,
            }: {
                defineStore: ReportDefineTypeOfModel;
            } = getRoot<IAnyModelType>(self);

            self.reportHasChanged = true;
            self.formData.set(targetId, targetValue);
            self.formState.set(targetId, {
                ...self.formState.get(targetId),
                ...validate(targetId, targetValue),
                ...staticState,
            });

            if (targetId === 'ReportTemplate') {
                defineStore.setFormDefine(self.formData.toJSON());
                initReportData();
                initialFormControl();
            }
        };

        // Validate field
        const validate = (id: string, value: any): FormControl => {
            const state = {
                isDirty: true,
                isValid: true,
                errorMessage: '',
                fromModal: '',
            };

            const field = reportDefineService.getField(id);
            if (!field) return state;

            const validateRules = field?.validate;

            if (!validateRules) {
                return state;
            }

            const { errorMessage, isValid } = validationService.validate(
                value,
                validateRules,
                self.formData.toJSON(),
            );

            return {
                isDirty: true,
                isValid,
                errorMessage,
                fromModal: field.fromModal || '',
            };
        };

        // Normal field
        const valueChanged = (id: string, value: any) => {
            changeValue(id, value);

            if (!self.reportTemplate) return;
            const { formDefine } = reportDefineService.getFormDefine(self.reportTemplate);

            // Change value by its id
            reportDataService.postValueChangedById(
                id,
                self.formData.toJSON(),
                formDefine,
                changeValue,
            );

            // Change value by its action
            if (!reportDefineService.currentFields) return;
            const field = reportDefineService.getField(id);
            if (!field) return;
            reportDataService.postValueChangedByAction(
                {
                    id,
                    field,
                    value,
                    data: self.formData.toJSON(),
                    define: reportDefineService.currentFields,
                },
                changeValue,
            );
        };

        // Array field
        const arrayValueChanged = (
            idx: number,
            id: string,
            targetId: string,
            arrayValue: any[],
            targetValue: any,
        ) => {
            changeValue(id, arrayValue);

            // Change value by its action
            if (!reportDefineService.currentFields) return;
            const field = reportDefineService.getField(targetId);
            if (!field) return;
            reportDataService.postValueChangedByAction(
                {
                    id,
                    field,
                    value: targetValue,
                    arrayIdx: idx,
                    data: self.formData.toJSON(),
                    define: reportDefineService.currentFields,
                },
                changeValue,
            );
        };

        const cleanupAllReportState = () => {
            self.loading = false;
            self.formData.clear();
            self.formState.replace({});
            self.formValidation = { isValid: true, openModalName: '' };
            const { imageStore }: { imageStore: ImageTypeOfModel } = getRoot<IAnyModelType>(self);
            imageStore.initImages([]);
        };

        const initReportData = () => {
            const {
                defineStore,
            }: {
                defineStore: ReportDefineTypeOfModel;
            } = getRoot<IAnyModelType>(self);

            // 如果是第一次進入Report，套用預設的資料
            if (self.formData.get('ReportStatus') === ReportStatus.New) {
                Object.entries(defineStore.normalizeFields).forEach(([key, field]) => {
                    if (field.initMapping && self.formData.get(field.initMapping)) {
                        self.formData.set(key, self.formData.get(field.initMapping));
                    }
                });
            }
        };

        const initialFormControl = () => {
            const documentData = self.formData.toJSON();
            const { fields } = reportDefineService.getFormDefine(
                documentData?.ReportTemplate || 'Blank',
            );

            const initialState = {};
            Object.entries(fields).forEach(([fieldId, field]) => {
                const state = {
                    isDirty: false,
                    isValid: true,
                    errorMessage: '',
                    fromModal: '',
                };
                if (!field?.validate) {
                    initialState[fieldId] = state;
                    return;
                }

                const { isValid, errorMessage } = validationService.validate(
                    documentData[fieldId],
                    field.validate,
                    documentData,
                );

                initialState[fieldId] = {
                    ...state,
                    isValid,
                    errorMessage,
                    fromModal: field.fromModal || '',
                };
            });

            self.formState.replace(initialState);
            self.formValidation = { isValid: true, openModalName: '' };
        };

        return {
            valueChanged,
            arrayValueChanged,
            validate,
            initReportData,
            initialFormControl,
            cleanupAllReportState,
            resetFormData: (formData: DocumentData) => self.formData.replace(formData),
            resetFormState: (state: FormState) => self.formState.replace(state),
        };
    })
    .actions((self) => {
        const checkFormIsValid = () => {
            self.formValidation = { isValid: true, openModalName: '' };
            const newFormState = {};
            Array.from(self.formState).forEach(([key, state]: [string, FormControl]) => {
                if (!state.isValid) {
                    const openModalName = state.fromModal;
                    self.formValidation = { isValid: false, openModalName };
                }
                newFormState[key] = { ...state, isDirty: true };

                if (!state.isValid) {
                    console.error(`${key}: ${state.errorMessage}`);
                }
            });

            self.formState.replace(newFormState);
            return self.formValidation.isValid;
        };

        const saveReport$ = () => {
            // 沒編輯過不要做任何動作
            if (!self.reportHasChanged) return of({ response: { data: { Message: '' } } });
            self.formData.set('ReportStatus', ReportStatus.Saved);

            return iif(
                () => checkFormIsValid(),
                saveReport(self.formData.toJSON()),
                throwError(formInvalidError),
            );
        };

        const signReport$ = () => {
            self.formData.set('ReportStatus', ReportStatus.Signed);

            return iif(
                () => checkFormIsValid(),
                saveReport(self.formData.toJSON()),
                throwError(formInvalidError),
            );
        };

        const callApi = (
            obs: Observable<any>,
            dollSignal: (payload: ReportResponseNotification) => void,
            message: string,
            callback?: () => void,
        ) => {
            return obs.pipe(
                map((res) => [
                    action(fetchSuccess, res, callback),
                    action(dollSignal, {
                        notification: { message, messageType: MessageType.Success },
                        response: res.data,
                    }),
                ]),
                startWith(action(() => (self.loading = true))),
                catchError((error: AxiosError<{ Message: string }>) => [
                    action(() => (self.loading = false)),
                    action(dollSignal, {
                        notification: {
                            message: error.response?.data.Message || error.message,
                            messageType: MessageType.Error,
                        },
                    }),
                ]),
            );
        };

        const fetchSuccess = (response: AxiosResponse, callback?: () => void) => {
            self.loading = false;
            self.reportHasChanged = false;
            callback?.();
        };

        return {
            saveTempReportData: () => {
                // 未簽核報告的暫存資料
                if (!self.studyInsUID) return;
                LocalStorageService.writeToLocalStorage(self.studyInsUID, self.formData.toJSON());
            },
            saveReport: dollEffect<null, ReportResponseNotification>(
                self,
                (payload$, dollSignal) => {
                    return payload$.pipe(
                        switchMap(() => callApi(saveReport$(), dollSignal, 'Report save success')),
                    );
                },
            ),
            signOffReport: dollEffect<null, ReportResponseNotification>(
                self,
                (payload$, dollSignal) => {
                    const callback = () => {
                        self.modifiable = false;
                        LocalStorageService.removeFromLocalStorage(self.studyInsUID);
                    };
                    return payload$.pipe(
                        switchMap(() =>
                            callApi(signReport$(), dollSignal, 'Report sign-off success', callback),
                        ),
                    );
                },
            ),
            fetchReportLockStatus: dollEffect<string, string>(self, (payload$, dollSignal) => {
                return payload$.pipe(
                    switchMap((studyInstanceUID) =>
                        getReportLockStatus(studyInstanceUID).pipe(
                            map((res) => [
                                action(() => {
                                    self.lockByUser = res.data || '';
                                    // is null or userId
                                    self.modifiable = isEmptyOrNil(res.data);
                                }),
                                action(dollSignal, res.data),
                            ]),
                        ),
                    ),
                );
            }),
            lockReport: effect<string>(self, (payload$) => {
                return payload$.pipe(
                    switchMap((studyInstanceUID) =>
                        lockReport(studyInstanceUID).pipe(map(() => action(() => {}))),
                    ),
                );
            }),
            unlockReport: effect<string>(self, (payload$) => {
                return payload$.pipe(
                    switchMap((studyInstanceUID) =>
                        unlockReport(studyInstanceUID).pipe(map(() => action(() => {}))),
                    ),
                );
            }),
        };
    })
    // Report
    .actions((self) => {
        const beforeFetch = () => (self.loading = true);

        const fetchError = () => (self.loading = false);

        const fetchSuccess = (response: AxiosResponse<DocumentData>) => {
            const {
                defineStore,
                imageStore,
            }: {
                defineStore: ReportDefineTypeOfModel;
                imageStore: ImageTypeOfModel;
            } = getRoot<IAnyModelType>(self);

            const userId = LocalStorageService.getFromLocalStorage<LoginResult>('user')?.UserId;

            // set initialize data
            self.formData.replace(response.data);
            imageStore.initImages(response.data?.ReportImageData || []);

            // 如果ReportStatus不是Signed，並要在每次進來報告時套用
            let isApplyReportTempData = false;
            if (self.formData.get('ReportStatus') === ReportStatus.New) {
                if (!response?.data?.StudyInstanceUID) return;
                // apply local storage data, when newly report
                if (LocalStorageService.getFromLocalStorage(response.data.StudyInstanceUID)) {
                    const tempData: DocumentData = JSON.parse(
                        <string>window.localStorage.getItem(response.data.StudyInstanceUID),
                    );
                    delete tempData.ReportStatus;
                    delete tempData.Author;
                    delete tempData.UserId;
                    self.formData.replace(tempData);
                    // 從資料庫獲取的影像資料可能也別於暫存資料，所以要合併，並把暫存資料上存在在的資料用SopInstanceUID做比對，然後套用
                    const combinedArray = (response.data?.ReportImageData || []).map((item1) => {
                        const matchingItem = (tempData?.ReportImageData || []).find(
                            (item2) => item2.SOPInstanceUID === item1.SOPInstanceUID,
                        );
                        return matchingItem || item1;
                    });
                    imageStore.initImages([...combinedArray]);
                    isApplyReportTempData = true;
                }
            }

            // initialize form control
            self.formData.set('UserId', userId);
            defineStore.setFormDefine(self.formData.toJSON());
            self.initReportData();
            self.initialFormControl();

            self.reportHasChanged = isApplyReportTempData;
            self.modifiable = response.data.ReportStatus !== ReportStatus.Signed;
            self.loading = false;
        };

        return {
            fetchReport: dollEffect<string, ReportResponseNotification>(
                self,
                (payload$, dollSignal) => {
                    return payload$.pipe(
                        switchMap((studyInstanceUID) =>
                            fetchReport(studyInstanceUID).pipe(
                                map((response) => [
                                    action(fetchSuccess, response),
                                    action(dollSignal, {
                                        notification: {
                                            message: 'Fetch report success',
                                            messageType: MessageType.Success,
                                        },
                                    }),
                                ]),
                                startWith(action(beforeFetch)),
                                catchError((error: AxiosError<{ Message: string }>) => [
                                    action(fetchError),
                                    action(dollSignal, {
                                        notification: {
                                            message: error.response?.data.Message || error.message,
                                            messageType: MessageType.Error,
                                        },
                                    }),
                                ]),
                            ),
                        ),
                    );
                },
            ),
        };
    })
    // History Report
    .actions((self) => {
        const beforeFetch = () => (self.loading = true);

        const fetchError = () => (self.loading = false);

        const fetchSuccess = (response: AxiosResponse<DocumentData>) => {
            const { imageStore }: { imageStore: ImageTypeOfModel } = getRoot<IAnyModelType>(self);

            // set initialize data
            self.formData.replace(response.data);
            imageStore.initImages(response.data?.ReportImageData || []);

            self.reportHasChanged = false;
            self.modifiable = false;
            self.loading = false;
        };

        return {
            fetchHistoryReport: dollEffect<
                { studyInstanceUID: string; version: string },
                ReportResponseNotification
            >(self, (payload$, dollSignal) => {
                return payload$.pipe(
                    switchMap(({ studyInstanceUID, version }) =>
                        fetchHistoryReport(studyInstanceUID, version).pipe(
                            map((response) => [
                                action(fetchSuccess, response),
                                action(dollSignal, {
                                    notification: {
                                        message: 'Fetch report success',
                                        messageType: MessageType.Success,
                                    },
                                }),
                            ]),
                            startWith(action(beforeFetch)),
                            catchError((error: AxiosError<{ Message: string }>) => [
                                action(fetchError),
                                action(dollSignal, {
                                    notification: {
                                        message: error.response?.data.Message || error.message,
                                        messageType: MessageType.Error,
                                    },
                                }),
                            ]),
                        ),
                    ),
                );
            }),
        };
    }) // Report Generator
    .actions((self) => {
        const simulateReport = () => {
            self.reportHasChanged = false;
            self.modifiable = true;
            self.loading = false;
            self.formData.replace({
                StudyInstanceUID: '1.3.6.1.4.1.29974.12.20221024.100121.102062',
                StudyDate: '20221026',
                PatientId: 'K0844950',
                PatientsName: 'TEST102062',
                PatientsSex: 'F',
                PatientsBirthDate: '19910101',
                PatientsAge: '31',
                Version: '1',
                ReportStatus: 'Saved',
                Author: 'Admin',
                ReferringPhysiciansName: 'ReferringPhysiciansName',
                NameofPhysiciansReading: 'NameofPhysiciansReading',
                PerformingPhysiciansName: 'PerformingPhysiciansName',
                ReportTemplate: 'Colonoscopy',
                AccessionNumber: 'AP20221024102062',
                StudyDescription: 'Colonoscopy',
                LastSignOffExecuteTime: 'LastSignOffExecuteTime',
                Modality: 'SC',
                DateTime: '2022-12-28T14:45:36',
                DiagramData: 'https://picsum.photos/320/180',
                ReportImageData: [
                    {
                        SOPInstanceUID: '1.3.6.1.4.1.29974.12.20221024.100121.102062.2.1',
                        ImageSrc: 'https://picsum.photos/320/180',
                        thumbnailImageSrc: 'https://picsum.photos/320/180',
                        EditedImageSrc: '',
                        IsAttachInReport: false,
                        MappingNumber: 0,
                        DescriptionOfSites: '',
                        DescriptionOfFindings: '',
                        ReportMark: null,
                    },
                ],
            });

            const { imageStore } = getRoot<IAnyModelType>(self);
            imageStore.initImages(self.formData.get('ReportImageData'));
        };

        return { simulateReport };
    });
