import { AxiosError, AxiosResponse } from 'axios';
import { action, dollEffect, effect, getEnv, getRoot, Instance, types } from 'mst-effect';
import { iif, interval, Observable, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, startWith, switchMap } from 'rxjs/operators';

import { previewReport, saveReport, signOffReport } from '../axios/api';
import { AnyObject } from '../interface/anyObject';
import { DocumentData } from '../interface/document-data';
import { FormControl, FormState } from '../interface/form-state';
import { MessageType, ReportResponseNotification } from '../interface/notification';
import { PatientInfo } from '../interface/patient-info';
import { ReportValidation } from '../interface/report-validation';
import { RootService } from '../interface/root-service';
import { formatDateTime, isEmptyOrNil, spiltDateTime } from '../utils/general';

const dateModel = types.union(types.frozen<DocumentData>());
const formState = types.union(types.frozen<FormState>());

const formInvalidError = { response: { data: { Message: 'Required fields are not filled.' } } };

export const DataModel = types
    .model('report', {
        reportReady: types.optional(types.enumeration(['prepare', 'success', 'error']), 'prepare'),
        modifiable: types.optional(types.boolean, false),
        reportHasChanged: types.optional(types.boolean, false),
        loading: types.optional(types.boolean, false),
        formData: types.map(dateModel),
        formState: types.map(formState),
        patientInfo: types.frozen<PatientInfo | undefined>(undefined),
        documentNumber: types.optional(types.string, ''),
        formValidation: types.optional(types.frozen<ReportValidation>(), {
            isValid: true,
            openModalName: '',
        }),
    })
    /* eslint-disable no-param-reassign */
    .views((self) => {
        return {
            get reportDisabled() {
                if (self.modifiable) return false;
                return self.formData.get('ReportStatus') === 'signed';
            },
            get reportHasSignOff() {
                return self.formData.get('ReportStatus') === 'signed';
            },
            get pdfFile() {
                if (isEmptyOrNil(self.formData.get('PDFFilePath'))) {
                    return undefined;
                }

                return `${self.formData.get('PDFFilePath')}`;
            },
            get patientHeaderInfo() {
                if (!self.patientInfo) {
                    return '';
                }

                return `${self.patientInfo?.chineseName},
                ${self.patientInfo?.otherName},
                ${self.patientInfo?.gender}/${self.patientInfo?.age}y,
                DOB: ${formatDateTime('YYYY-MM-DD', spiltDateTime(self.patientInfo?.birthdate))}, ${
                    self.patientInfo?.documentNumber
                },
                ${self.formData.get('EpisodeNo')}`;
            },
            get qualityModelIsValid() {
                return (
                    self.formState.get('QualityBowelScore').isValid &&
                    self.formState.get('QualityOfBowelPreparation').isValid &&
                    self.formState.get('IsCaecumReached').isValid &&
                    self.formState.get('WithdrawalTime').isValid
                );
            },
            get ersType() {
                return self.formData.get('ERSType');
            },
            get episodeNo() {
                return self.formData.get('EpisodeNo');
            },
            get studyInsUID() {
                return self.formData.get('StudyInstanceUID');
            },
            get user() {
                return self.formData.get('StaffCode');
            },
            get diagramData() {
                return self.formData.get('DiagramData');
            },
            get findings() {
                return self.formData.get('Findings');
            },
        };
    })
    .actions((self) => {
        const { reportDataService, reportDefineService, validationService } = getEnv<RootService>(
            self,
        );

        const modify = () => {
            self.modifiable = true;
        };

        const valueChanged = (id: string, value: any) => {
            const {
                defineStore: { setFormDefine },
            } = getRoot(self);

            const changeValue = (targetId, targetValue, staticState: Partial<FormControl> = {}) => {
                self.reportHasChanged = true;
                self.formData.set(targetId, targetValue);
                self.formState.set(targetId, {
                    ...self.formState.get(targetId),
                    ...validate(targetId, targetValue),
                    ...staticState,
                });
                setFormDefine(self.formData.toJSON());
            };
            changeValue(id, value);
            reportDataService.inject(id);
            reportDataService.postValueChanged(self.formData.toJSON(), changeValue);
        };

        const validate = (id: string, value: any): FormControl => {
            const field = reportDefineService.getField(id);
            const validateRules = field?.validate;
            const state = { isDirty: true, isValid: true, errorMessage: '', fromModal: '' };
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

        const initialFormControl = (documentData: DocumentData) => {
            const initialState = {};

            Object.keys(documentData).forEach((key) => {
                const state = { isDirty: false, isValid: true, errorMessage: '', fromModal: '' };

                const field = reportDefineService.getField(key);
                if (!field?.validate) {
                    initialState[key] = state;
                    return;
                }

                const { isValid, errorMessage } = validationService.validate(
                    documentData[key],
                    field.validate,
                    documentData,
                );

                initialState[key] = {
                    ...state,
                    isValid,
                    errorMessage,
                    fromModal: field.fromModal || '',
                };
            });
            self.formState.replace(initialState);
        };

        return {
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
            });

            self.formState.replace(newFormState);
            return self.formValidation.isValid;
        };

        const saveReport$ = () => {
            self.formData.set('SignOffsDateTime', '');
            self.formData.set('PDFFilePath', '');
            return iif(
                checkFormIsValid,
                saveReport(self.formData.toJSON()),
                throwError(formInvalidError),
            );
        };

        const signOffReport$ = () => {
            const body = {
                Episode: self.formData.get('EpisodeNo'),
                ProcedureID: self.formData.get('HISProcedureID'),
                Department: self.formData.get('Dept'),
                StaffCode: self.formData.get('StaffCode'),
            };

            const saveAndSignOff$ = saveReport$().pipe(concatMap(() => signOffReport(body)));
            const signOffOnly$ = signOffReport(body);

            return iif(
                () => self.reportHasChanged || self.formData.get('ReportStatus') === 'newly',
                saveAndSignOff$,
                signOffOnly$,
            );
        };

        const previewReport$ = () => {
            return self.formData.get('ReportStatus') === 'signed' && !self.reportHasChanged
                ? previewReport(self.studyInsUID, self.episodeNo, false)
                : saveReport$().pipe(
                      concatMap(() => previewReport(self.studyInsUID, self.episodeNo, true)),
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
            );
        };

        const beforeFetch = () => (self.loading = true);

        const fetchError = () => (self.loading = false);

        const fetchSuccess = (response: AxiosResponse<AnyObject>, callback?: () => void) => {
            Object.entries(response.data).forEach(([key, value]) => self.formData.set(key, value));
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
            previewReport: dollEffect<null, ReportResponseNotification>(
                self,
                (payload$, dollSignal) => {
                    return payload$.pipe(
                        switchMap(() =>
                            callApi(previewReport$(), dollSignal, 'Report save success'),
                        ),
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
                            callApi(
                                signOffReport$(),
                                dollSignal,
                                'Report sign off success',
                                callback,
                            ),
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
                    switchMap(() =>
                        interval(5000).pipe(
                            filter(
                                () =>
                                    self.formData.get('ReportStatus') === 'newly' &&
                                    self.reportReady === 'success',
                            ),
                            map(() => action(update)),
                        ),
                    ),
                );
            }),
        };
    });

export type DataStore = Instance<typeof DataModel>;
