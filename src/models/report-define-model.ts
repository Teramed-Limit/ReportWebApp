import { AxiosResponse } from 'axios';
import { action, dollEffect, getEnv, getRoot, IAnyModelType, Instance, types } from 'mst-effect';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { fetchReportDefine } from '../axios/api';
import { FormDefine, FormDefineMap } from '../interface/define';
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
        const fetchSuccess = ({ res }: { res: AxiosResponse<FormDefineMap> }) => {
            self.loading = false;
            self.formDefineMap = res.data;

            const { reportDefineService } = getEnv<RootService>(self);
            reportDefineService.registerFormDefine(res.data);
        };

        return {
            fetchDefine: dollEffect(self, (payload$) =>
                payload$.pipe(
                    switchMap((queryParams: any) =>
                        fetchReportDefine().pipe(
                            map((res) => [action(fetchSuccess, { res, queryParams })]),
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

                const { dataStore } = getRoot<IAnyModelType>(self);
                dataStore.initialFormControl();
            },
        };
    });

export type DefineStore = Instance<typeof DefineModel>;
