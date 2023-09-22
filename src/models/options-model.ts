import { AxiosResponse } from 'axios';
import { action, dollEffect, flow, getRoot, IAnyModelType, types } from 'mst-effect';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { OptionsModal } from './model-type/options-type-modal';
import { fetchCodeList, fetchCodeListByCode } from '../axios/api';
import { staticOptionType } from '../constant/static-options';
import { CodeList, CodeListMap } from '../interface/code-list';
import { FilterCondition, OptionSource } from '../interface/report-field/selection-field';

export const OptionStoreModel: OptionsModal = types
    .model('optionStore')
    .props({
        loading: types.optional(types.boolean, true),
        codeListMap: types.map(types.union(types.frozen<CodeList>())),
    })
    /* eslint-disable no-param-reassign */
    .views((self) => {
        const getCodeListByHttp = (
            optionSource: OptionSource<any>,
            filterCondition?: FilterCondition,
        ) => {
            const options = self.codeListMap.get(optionSource.source);
            if (!options) return [];
            if (filterCondition && filterCondition?.filterById) {
                const { filterById } = filterCondition;
                const { dataStore } = getRoot<IAnyModelType>(self);
                const filterStr = (dataStore.formData.get(filterById) as string) || '';

                return options.filter((option) => option.ParentCodeValue === filterStr);
            }

            return options;
        };

        const getCodeListByStatic = (optionSource: OptionSource<any>) => {
            return staticOptionType[optionSource.source];
        };

        return {
            getCodeList(
                optionSource: OptionSource<any>,
                filterCondition?: FilterCondition,
            ): CodeList[] {
                switch (optionSource.type) {
                    case 'http':
                        return getCodeListByHttp(optionSource, filterCondition);
                    case 'static':
                        return getCodeListByStatic(optionSource);
                    default:
                        return [];
                }
            },
        };
    })
    .actions((self) => {
        const fetchCodeListSuccess = ({ res }: { res: AxiosResponse<CodeListMap> }) => {
            // selection options
            self.loading = false;
            self.codeListMap.replace(res.data);
        };

        // eslint-disable-next-line require-yield,func-names
        const getLatestCodeList = flow(function* (optionSource: OptionSource<any>) {
            try {
                const res = yield fetchCodeListByCode(optionSource.source).toPromise();
                const options = res?.data || [];
                self.codeListMap.set(optionSource.source, options);
            } catch (error) {
                console.error(error);
            }
        });

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
            self.codeListMap.replace(data);
        };

        return {
            // initialize,
            initializeCodeList,
            setCodeListMap,
            getLatestCodeList,
        };
    });
