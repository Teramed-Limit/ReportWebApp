import { AxiosResponse } from 'axios';
import { action, dollEffect, getRoot, Instance, types } from 'mst-effect';
import * as R from 'ramda';
import { map, switchMap } from 'rxjs/operators';

import { fetchReportSetting } from '../axios/api';
import { staticOptionType } from '../constant/static-options';
import { ReportSetting } from '../interface/report-setting';
import { FilterCondition } from '../interface/selection-field';
import { uniqBy } from '../utils/general';

export const OptionStoreModel = types
    .model('optionStore')
    .props({
        optionMap: types.map(types.frozen<any[]>([])),
    })
    .views((self) => {
        return {
            getOptions(source: string, filterCondition?: FilterCondition) {
                const options = self.optionMap.get(source) || [];
                if (filterCondition?.filterById && filterCondition?.filterOptionKey) {
                    const { filterById, filterOptionKey } = filterCondition;
                    const { dataStore } = getRoot(self);
                    const filterStr = (dataStore.formData.get(filterById) as string) || '';

                    return options.filter((option) => option[filterOptionKey] === filterStr);
                }
                return options;
            },
        };
    })
    .actions((self) => {
        const fetchSuccess = ({ res: settingRes }: { res: AxiosResponse<ReportSetting> }) => {
            // selection options
            self.optionMap.replace(
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
        };

        const initialize = dollEffect(self, (payload$) =>
            payload$.pipe(
                switchMap((queryParams: any) =>
                    fetchReportSetting().pipe(
                        map((res) => [action(fetchSuccess, { res, queryParams })]),
                    ),
                ),
            ),
        );
        return {
            initialize,
        };
    });

export type OptionStore = Instance<typeof OptionStoreModel>;
