import { AxiosResponse } from 'axios';
import { action, dollEffect, getEnv, types } from 'mst-effect';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { ReportDefineModal } from './model-type/report-define-type-modal';
import { fetchReportDefine, fetchReportHistoryDefine } from '../axios/api';
import { FormDefine, FormDefineMap, FormHistoryDefine } from '../interface/define';
import { DocumentData } from '../interface/document-data';
import { Field } from '../interface/report-field/field';
import { RepPage } from '../interface/report-generator/rep-page';
import { RootService } from '../interface/root-service';
import { initRepPage } from '../logic/report-define/report-define-service';
import { isEmptyOrNil } from '../utils/general';

export const DefineModel: ReportDefineModal = types
    .model('define', {
        loading: types.optional(types.boolean, true),
        formDefineMap: types.frozen<FormDefineMap>({}),
        formDefine: types.optional(types.frozen<FormDefine>(), { sections: [] }),
        imageDefine: types.optional(types.frozen<Field[]>(), []),
        headerDefine: types.optional(types.frozen<RepPage>(), initRepPage('header')),
        footerDefine: types.optional(types.frozen<RepPage>(), initRepPage('footer')),
        normalizeFields: types.frozen<{ [props: string]: Field }>(),
    })
    /* eslint-disable no-param-reassign */
    .actions((self) => {
        const fetchDefineSuccess = (res: AxiosResponse<FormDefineMap>) => {
            self.loading = false;
            self.formDefineMap = res.data;

            const { reportDefineService } = getEnv<RootService>(self);
            reportDefineService.registerFormDefine(res.data);
        };

        const fetchHistoryDefineSuccess = (res: AxiosResponse<FormHistoryDefine>) => {
            self.loading = false;
            self.formDefine = JSON.parse(res.data.ReportDefine) as FormDefine;
        };

        return {
            fetchDefine: dollEffect(self, (payload$) =>
                payload$.pipe(
                    switchMap(() =>
                        fetchReportDefine().pipe(
                            map((response) => [action(fetchDefineSuccess, response)]),
                            startWith(action(() => (self.loading = true))),
                            catchError(() => [action(() => (self.loading = false))]),
                        ),
                    ),
                ),
            ),
            fetchHistoryDefine: dollEffect<{ studyInstanceUID: string; version: string }, any>(
                self,
                (payload$) =>
                    payload$.pipe(
                        switchMap(({ studyInstanceUID, version }) =>
                            fetchReportHistoryDefine(studyInstanceUID, version).pipe(
                                map((response) => [action(fetchHistoryDefineSuccess, response)]),
                                startWith(action(() => (self.loading = true))),
                                catchError(() => [action(() => (self.loading = false))]),
                            ),
                        ),
                    ),
            ),
            setFormDefine: (formData: DocumentData) => {
                const { reportDefineService } = getEnv<RootService>(self);
                const { formDefine, imageDefine, fields, headerDefine, footerDefine } =
                    reportDefineService.getFormDefine(formData?.ReportTemplate || 'Blank');

                self.formDefine = formDefine;
                self.imageDefine = imageDefine;
                self.headerDefine = isEmptyOrNil(headerDefine)
                    ? initRepPage('header')
                    : headerDefine;
                self.footerDefine = isEmptyOrNil(footerDefine)
                    ? initRepPage('footer')
                    : footerDefine;
                self.normalizeFields = fields;
            },
        };
    });
