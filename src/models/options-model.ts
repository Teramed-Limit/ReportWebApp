import { AxiosResponse } from 'axios';
import { action, dollEffect, getRoot, IAnyModelType, Instance, types } from 'mst-effect';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { fetchCodeList } from '../axios/api';
import { CodeList, CodeListMap } from '../interface/code-list';
import { FilterCondition } from '../interface/selection-field';

export const OptionStoreModel = types
    .model('optionStore')
    .props({
        loading: types.optional(types.boolean, true),
        optionMap: types.map(types.frozen<any[]>([])),
        codeListMap: types.frozen<CodeListMap>({}),
    })
    /* eslint-disable no-param-reassign */
    .views((self) => {
        return {
            getOptions(source: string, filterCondition?: FilterCondition) {
                const options = self.optionMap.get(source) || [];
                if (filterCondition?.filterById && filterCondition?.filterOptionKey) {
                    const { filterById, filterOptionKey } = filterCondition;
                    const { dataStore } = getRoot<IAnyModelType>(self);
                    const filterStr = (dataStore.formData.get(filterById) as string) || '';

                    return options.filter((option) => option[filterOptionKey] === filterStr);
                }
                return options;
            },
            getCodeList(source: string, filterCondition?: FilterCondition): CodeList[] {
                const options = self.codeListMap[source];
                if (!options) return [];

                if (filterCondition?.filterById) {
                    const { filterById } = filterCondition;
                    const { dataStore } = getRoot<IAnyModelType>(self);
                    const filterStr = (dataStore.formData.get(filterById) as string) || '';

                    return options.filter((option) => option.ParentCodeValue === filterStr);
                }

                return options;
            },
        };
    })
    .actions((self) => {
        // const fetchSuccess = ({ res: settingRes }: { res: AxiosResponse<ReportSetting> }) => {
        //     // selection options
        //     self.loading = false;
        //     self.optionMap.replace(
        //         new Map<string, any[]>(Object.entries({ ...settingRes.data }))
        //             .set('Min', staticOptionType.Min)
        //             .set('Hour', staticOptionType.Hour)
        //             .set('ColonDetail', staticOptionType.ColonDetail)
        //             .set('AdequateInadequate', staticOptionType.AdequateInadequate)
        //             .set('YesNo', staticOptionType.YesNo)
        //             .set('Dosage', staticOptionType.Dosage)
        //             .set(
        //                 'ReportReportTemplateList',
        //                 uniqBy(settingRes.data.ReportReportTemplateList, R.path(['Name'])),
        //             ),
        //     );
        // };

        const fetchCodeListSuccess = ({ res }: { res: AxiosResponse<CodeListMap> }) => {
            // selection options
            self.loading = false;
            self.codeListMap = res.data;
        };

        // const initialize = dollEffect(self, (payload$) =>
        //     payload$.pipe(
        //         switchMap((queryParams: any) =>
        //             fetchReportSetting().pipe(
        //                 map((res) => [action(fetchSuccess, { res, queryParams })]),
        //                 startWith(action(() => (self.loading = true))),
        //                 catchError(() => [action(() => (self.loading = false))]),
        //             ),
        //         ),
        //     ),
        // );

        const initializeCodeList = dollEffect(self, (payload$) =>
            payload$.pipe(
                switchMap((queryParams: any) =>
                    fetchCodeList().pipe(
                        map((res) => [action(fetchCodeListSuccess, { res, queryParams })]),
                        startWith(action(() => (self.loading = true))),
                        catchError(() => [action(() => (self.loading = false))]),
                    ),
                ),
            ),
        );

        const setCodeListMap = (data: CodeListMap) => {
            self.codeListMap = data;
        };

        return {
            // initialize,
            initializeCodeList,
            setCodeListMap,
        };
    });

export type OptionStore = Instance<typeof OptionStoreModel>;
