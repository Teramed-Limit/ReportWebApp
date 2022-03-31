import { AxiosError, AxiosResponse } from 'axios';
import { action, dollEffect, Instance, types } from 'mst-effect';
import * as R from 'ramda';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, map, startWith, switchMap } from 'rxjs/operators';

import { fetchReport, fetchReportSetting } from '../axios/api';
import { staticOptionType } from '../constant/static-options';
import { DocumentData } from '../interface/document-data';
import { MessageType, Notification } from '../interface/notification';
import { ReportSetting } from '../interface/report-setting';
import { uniqBy } from '../utils/general';
import { AuthModel } from './auth-model';
import { OptionStoreModel } from './options-model';
import { QueryModel } from './query-model';
import { DataModel } from './report-data-model';
import { DefineModel } from './report-define-model';
import { ImageModel } from './report-image-model';

export const RootStoreModel = types
    .model('root', {
        authStore: AuthModel,
        optionStore: OptionStoreModel,
        dataStore: DataModel,
        defineStore: DefineModel,
        imageStore: ImageModel,
        queryStore: QueryModel,
    })
    /* eslint-disable no-param-reassign */
    .views((self) => ({
        get formDefine() {
            return self.defineStore.formDefine;
        },
        get formData() {
            return self.dataStore.formData;
        },
    }))
    .actions((self) => {
        const beforeFetch = () => {
            self.dataStore.loading = true;
        };

        const fetchError = () => {
            self.dataStore.loading = false;
            self.dataStore.reportReady = 'error';
        };

        const fetchSuccess = ({
            res: [dataRes, settingRes],
        }: {
            res: [AxiosResponse<DocumentData>, AxiosResponse<ReportSetting>];
        }) => {
            // patient info
            // self.dataStore.patientInfo = {
            //     chineseName: patientAndDoctorRes.data[0].NameChinese,
            //     otherName: patientAndDoctorRes.data[0].OtherName,
            //     gender: patientAndDoctorRes.data[0].Sex,
            //     age: dobToAge(patientAndDoctorRes.data[0].Birthdate),
            //     birthdate: patientAndDoctorRes.data[0].Birthdate,
            // };

            // selection options
            self.optionStore.optionMap.replace(
                new Map<string, any[]>(Object.entries({ ...settingRes.data }))
                    .set('Min', staticOptionType.Min)
                    .set('Hour', staticOptionType.Hour)
                    .set('ColonDetail', staticOptionType.ColonDetail)
                    .set('AdequateInadequate', staticOptionType.AdequateInadequate)
                    .set('YesNo', staticOptionType.YesNo)
                    .set(
                        'ReportERSTypeList',
                        uniqBy(settingRes.data.ReportERSTypeList, R.path(['Name'])),
                    ),
            );

            // report image
            self.imageStore.images.replace(dataRes.data.ReportImageDataset || []);

            // set initialize data
            self.dataStore.formData.replace(dataRes.data);
            self.dataStore.formData.set('OwnerId', 'Demo User');
            // self.dataStore.formData.set('ChiefEndoscopist', ChiefDoctorList[0].Name);
            // self.dataStore.formData.set(
            //     'ProcedureDate',
            //     formatDateTime('YYYY-MM-DD', spiltDateTime(ProcedureDatetime)),
            // );

            // report not existed, auto set value
            if (dataRes.data.ReportStatus === 'newly') {
                // apply local storage data, when newly report
                if (window.localStorage.getItem(self.dataStore.studyInsUID)) {
                    const tempData: DocumentData = JSON.parse(
                        <string>window.localStorage.getItem(self.dataStore.studyInsUID),
                    );
                    // tempData.Author = queryParams.staffCode;
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

        const initialize = dollEffect<any, Notification>(self, (payload$, dollSignal) =>
            payload$.pipe(
                switchMap((queryParams: any) =>
                    fetchReport('').pipe(
                        concatMap((documentData) =>
                            forkJoin([of(documentData), fetchReportSetting()]),
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
        return { initialize };
    });

export type RootStore = Instance<typeof RootStoreModel>;
