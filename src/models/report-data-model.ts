import { AxiosError, AxiosResponse } from 'axios';
import {
    action,
    dollEffect,
    effect,
    getEnv,
    getRoot,
    IAnyModelType,
    Instance,
    types,
} from 'mst-effect';
import { iif, interval, Observable, of, throwError } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { fetchHistoryReport, fetchReport, saveReport } from '../axios/api';
import { DocumentData, ReportStatus } from '../interface/document-data';
import { FormControl, FormState } from '../interface/form-state';
import { MessageType, ReportResponseNotification } from '../interface/notification';
import { ReportValidation } from '../interface/report-validation';
import { RootService } from '../interface/root-service';
import { RegisterReportDefineMap } from '../logic/report-define/report-define-service';
import { isEmptyOrNil } from '../utils/general';

const dateModel = types.union(types.frozen<DocumentData>());
const formState = types.union(types.frozen<FormState>());

const formInvalidError = {
    response: { data: { Message: 'Required fields are not filled.' } },
};

export const DataModel = types
    .model('report', {
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
        };
    })
    .actions((self) => {
        const { reportDataService, reportDefineService, validationService } =
            getEnv<RootService>(self);

        const init = () => {
            self.formData.replace({});
            self.formState.replace({});
            self.formValidation = { isValid: true, openModalName: '' };
        };

        const modify = () => {
            self.modifiable = true;
        };

        const valueChanged = (id: string, value: any) => {
            const {
                defineStore: { setFormDefine },
            } = getRoot<IAnyModelType>(self);

            const changeValue = (targetId, targetValue, staticState: Partial<FormControl> = {}) => {
                self.reportHasChanged = true;
                self.formData.set(targetId, targetValue);
                self.formState.set(targetId, {
                    ...self.formState.get(targetId),
                    ...validate(targetId, targetValue),
                    ...staticState,
                });

                if (targetId === 'ReportTemplate') setFormDefine(self.formData.toJSON());
            };
            changeValue(id, value);
            reportDataService.inject(id);
            reportDataService.postValueChanged(self.formData.toJSON(), changeValue);
        };

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
        };

        return {
            init,
            modify,
            valueChanged,
            validate,
            initialFormControl,
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
            self.formData.set('ReportStatus', ReportStatus.Saved);

            // 沒編輯過不要做任何動作
            if (!self.reportHasChanged) return of({ response: { data: { Message: '' } } });

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
                catchError((error: AxiosError) => [
                    action(() => (self.loading = false)),
                    action(dollSignal, {
                        notification: {
                            message: error.response?.data.Message,
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
                        window.localStorage.removeItem(self.studyInsUID);
                    };
                    return payload$.pipe(
                        switchMap(() =>
                            callApi(signReport$(), dollSignal, 'Report sign-off success', callback),
                        ),
                    );
                },
            ),
            autoSaveToLocalStorage: effect(self, (payload$) => {
                function update() {
                    window.localStorage.setItem(
                        self.studyInsUID,
                        JSON.stringify(self.formData.toJSON()),
                    );
                }

                return payload$.pipe(
                    switchMap(() => interval(5000).pipe(map(() => action(update)))),
                );
            }),
        };
    })
    // Report
    .actions((self) => {
        const beforeFetch = () => (self.loading = true);

        const fetchError = () => (self.loading = false);

        const fetchSuccess = (response: AxiosResponse<DocumentData>) => {
            const { defineStore, imageStore, authStore } = getRoot<IAnyModelType>(self);

            // set initialize data
            response.data.Author = authStore.loginUser;
            self.formData.replace(response.data);

            imageStore.initImages(response.data?.ReportImageData || []);

            // report not existed, auto set value
            if (response.data.ReportStatus === ReportStatus.InComplete) {
                // autofill studyDescription in ReportTemplate
                if (
                    response.data.StudyDescription &&
                    RegisterReportDefineMap[response.data.StudyDescription]
                ) {
                    self.formData.set('ReportTemplate', response.data.StudyDescription);
                }

                // apply local storage data, when newly report
                if (window.localStorage.getItem(self.studyInsUID)) {
                    const tempData: DocumentData = JSON.parse(
                        <string>window.localStorage.getItem(self.studyInsUID),
                    );
                    self.formData.replace(tempData);
                    imageStore.initImages(tempData.ReportImageData || []);
                }
            }

            // initialize form control
            defineStore.setFormDefine(self.formData.toJSON());
            self.reportHasChanged = false;
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
                                catchError((error: AxiosError) => [
                                    action(fetchError),
                                    action(dollSignal, {
                                        notification: {
                                            message: error.response?.data.Message,
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
            const { imageStore } = getRoot<IAnyModelType>(self);

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
                            catchError((error: AxiosError) => [
                                action(fetchError),
                                action(dollSignal, {
                                    notification: {
                                        message: error.response?.data.Message,
                                        messageType: MessageType.Error,
                                    },
                                }),
                            ]),
                        ),
                    ),
                );
            }),
        };
    });

export type DataStore = Instance<typeof DataModel>;
