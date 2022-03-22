import { AxiosError, AxiosResponse } from 'axios';
import { action, dollEffect, Instance, types } from 'mst-effect';
import * as R from 'ramda';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, map, startWith, switchMap } from 'rxjs/operators';

import {
    fetchInstrumentList,
    fetchNurse,
    fetchPatientAndDoctor,
    fetchReport,
    fetchReportSetting,
} from '../axios/api';
import { staticOptionType } from '../constant/static-options';
import { DocumentData } from '../interface/document-data';
import { MessageType, Notification } from '../interface/notification';
import { Option } from '../interface/option';
import { PatientProcedureInfo } from '../interface/procedure-info';
import { ReportSetting } from '../interface/report-setting';
import { dobToAge, formatDateTime, isEmptyOrNil, spiltDateTime, uniqBy } from '../utils/general';
import { OptionStoreModel } from './options-model';
import { DataModel } from './report-data-model';
import { DefineModel } from './report-define-model';
import { ImageModel } from './report-image-model';

export interface QueryParams {
    episodeNo: string;
    procedureId: string;
    dept: string;
    staffCode: string;
}

export const RootStoreModel = types
    .model('root', {
        optionStore: OptionStoreModel,
        dataStore: DataModel,
        defineStore: DefineModel,
        imageStore: ImageModel,
        queryParams: types.frozen<QueryParams>(),
    })
    /* eslint-disable no-param-reassign */
    .views((self) => ({
        get formDefine() {
            return self.defineStore.formDefine;
        },
        get formData() {
            return self.dataStore.formData;
        },
        get isQueryParamsValid() {
            return (
                !isEmptyOrNil(self.queryParams.episodeNo) &&
                !isEmptyOrNil(self.queryParams.procedureId) &&
                !isEmptyOrNil(self.queryParams.staffCode) &&
                !isEmptyOrNil(self.queryParams.dept)
            );
        },
    }))
    .actions((self) => {
        const setQueryParams = (queryParams: QueryParams) => (self.queryParams = queryParams);
        return { setQueryParams };
    })
    .actions((self) => {
        const beforeFetch = () => {
            self.dataStore.loading = true;
        };

        const fetchError = () => {
            self.dataStore.loading = false;
            self.dataStore.reportReady = 'error';
        };

        const fetchSuccess = ({
            res: [dataRes, settingRes, nurseRes, patientAndDoctorRes, instrumentRes],
            queryParams,
        }: {
            res: [
                AxiosResponse<DocumentData>,
                AxiosResponse<ReportSetting>,
                AxiosResponse<Option[]>,
                AxiosResponse<PatientProcedureInfo[]>,
                AxiosResponse<Option[]>,
            ];
            queryParams: QueryParams;
        }) => {
            const {
                EndoDoctorList,
                AnesDoctorList,
                ChiefDoctorList,
                LstHISPatientProcedure,
                TimeStartHour,
                TimeStartMin,
                TimeEndHour,
                TimeEndMin,
            } = patientAndDoctorRes.data[0];
            const { ProcedureCode, ProcedureDatetime, SedationType } = LstHISPatientProcedure[0];

            // patient info
            self.dataStore.patientInfo = {
                chineseName: patientAndDoctorRes.data[0].NameChinese,
                otherName: patientAndDoctorRes.data[0].OtherName,
                gender: patientAndDoctorRes.data[0].Sex,
                age: dobToAge(patientAndDoctorRes.data[0].Birthdate),
                birthdate: patientAndDoctorRes.data[0].Birthdate,
                documentNumber: patientAndDoctorRes.data[0].DocumentNumber,
            };

            // selection options
            self.optionStore.optionMap.replace(
                new Map<string, any[]>(Object.entries({ ...settingRes.data }))
                    .set('Min', staticOptionType.Min)
                    .set('Hour', staticOptionType.Hour)
                    .set('ColonDetail', staticOptionType.ColonDetail)
                    .set('AdequateInadequate', staticOptionType.AdequateInadequate)
                    .set('YesNo', staticOptionType.YesNo)
                    .set('Nurse', nurseRes.data)
                    .set('Anesthesiologist', AnesDoctorList)
                    .set('Endoscopist', EndoDoctorList)
                    .set('Instrument', instrumentRes.data)
                    .set(
                        'ReportERSTypeList',
                        uniqBy(settingRes.data.ReportERSTypeList, R.path(['Name'])),
                    ),
            );

            // report image
            self.imageStore.images.replace(dataRes.data.ReportImageDataset || []);

            // set initialize data
            self.dataStore.documentNumber = patientAndDoctorRes.data[0].DocumentNumber;
            self.dataStore.formData.replace(dataRes.data);
            self.dataStore.formData.set('StaffCode', queryParams.staffCode);
            self.dataStore.formData.set('Author', queryParams.staffCode);
            self.dataStore.formData.set('OwnerId', 'Demo User');
            self.dataStore.formData.set('ChiefEndoscopist', ChiefDoctorList[0].Name);
            self.dataStore.formData.set(
                'ProcedureDate',
                formatDateTime('YYYY-MM-DD', spiltDateTime(ProcedureDatetime)),
            );

            // report not existed, auto set value
            if (dataRes.data.ReportStatus === 'newly') {
                const defaultERSType = settingRes.data.ReportERSTypeList.find(
                    (option) => option.ProcedureCode === ProcedureCode,
                )?.Name;

                self.dataStore.formData.set('ERSType', defaultERSType || '');
                self.dataStore.formData.set('Sedation', SedationType);
                self.dataStore.formData.set('StartTimeHour', TimeStartHour);
                self.dataStore.formData.set('StartTimeMin', TimeStartMin);
                self.dataStore.formData.set('EndTimeHour', TimeEndHour);
                self.dataStore.formData.set('EndTimeMin', TimeEndMin);

                // apply local storage data, when newly report
                if (window.localStorage.getItem(self.dataStore.studyInsUID)) {
                    const tempData: DocumentData = JSON.parse(
                        <string>window.localStorage.getItem(self.dataStore.studyInsUID),
                    );
                    tempData.Author = queryParams.staffCode;
                    self.dataStore.formData.replace(tempData);
                    self.imageStore.images.replace(tempData.ReportImageDataset || []);
                }
            }

            // initialize form control
            self.defineStore.setFormDefine(self.dataStore.formData.toJSON());
            self.dataStore.initialFormControl(self.dataStore.formData.toJSON());
            self.dataStore.loading = false;
            self.dataStore.reportReady = 'success';
        };

        const initialize = dollEffect<QueryParams, Notification>(self, (payload$, dollSignal) =>
            payload$.pipe(
                switchMap((queryParams: QueryParams) =>
                    fetchReport(
                        queryParams.episodeNo,
                        queryParams.procedureId,
                        queryParams.dept,
                        queryParams.staffCode,
                    ).pipe(
                        concatMap((documentData) =>
                            forkJoin([
                                of(documentData),
                                fetchReportSetting(),
                                fetchNurse(queryParams.dept),
                                fetchPatientAndDoctor(
                                    queryParams.episodeNo,
                                    queryParams.procedureId,
                                    queryParams.dept,
                                ),
                                fetchInstrumentList(queryParams.episodeNo),
                            ]),
                        ),
                        map((res) => [
                            action(fetchSuccess, { res, queryParams }),
                            action(dollSignal, {
                                message: '',
                                messageType: MessageType.Success,
                            }),
                        ]),
                        startWith([action(beforeFetch)]),
                        catchError((error: AxiosError) => [
                            action(fetchError),
                            action(dollSignal, {
                                message: error.response?.data.Message,
                                messageType: MessageType.Error,
                            }),
                        ]),
                    ),
                ),
            ),
        );
        return {
            initialize,
            afterCreate() {
                if (window.location.pathname.includes('admin') && self.isQueryParamsValid) return;
                initialize(<QueryParams>{
                    episodeNo: self.queryParams.episodeNo,
                    procedureId: self.queryParams.procedureId,
                    dept: self.queryParams.dept,
                    staffCode: self.queryParams.staffCode,
                }).then(() => {
                    self.dataStore.autoSaveToLocalStorage();
                });
            },
        };
    });

export type RootStore = Instance<typeof RootStoreModel>;
