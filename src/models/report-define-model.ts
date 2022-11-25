import { AxiosResponse } from 'axios';
import { action, dollEffect, getEnv, Instance, types } from 'mst-effect';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { fetchReportDefine, fetchReportHistoryDefine } from '../axios/api';
import { FormDefine, FormDefineMap, FormHistoryDefine } from '../interface/define';
import { DocumentData } from '../interface/document-data';
import { RootService } from '../interface/root-service';

export const DefineModel = types
    .model('define', {
        loading: types.optional(types.boolean, true),
        formDefineMap: types.frozen<FormDefineMap>({}),
        formDefine: types.optional(types.frozen<FormDefine>(), { sections: [] }),
        pdfDefine: types.optional(types.frozen<FormDefine>(), { sections: [] }),
        normalizeFields: types.map(types.frozen<any>()),
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
            self.pdfDefine = JSON.parse(res.data.PDFDefine) as FormDefine;
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
                const { formDefine, pdfDefine } = reportDefineService.getFormDefine(
                    formData?.ReportTemplate || 'Blank',
                );

                self.formDefine = formDefine;
                self.pdfDefine = pdfDefine;
            },
        };
    });

export type DefineStore = Instance<typeof DefineModel>;
