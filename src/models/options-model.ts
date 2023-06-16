import { AxiosResponse } from 'axios';
import { action, dollEffect, flow, getRoot, IAnyModelType, types } from 'mst-effect';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { OptionsModal } from './model-type/options-type-modal';
import { fetchCodeList, fetchCodeListByCode } from '../axios/api';
import { CodeList, CodeListMap } from '../interface/code-list';
import { FilterCondition } from '../interface/selection-field';

export const OptionStoreModel: OptionsModal = types
    .model('optionStore')
    .props({
        loading: types.optional(types.boolean, true),
        // optionMap: types.map(types.frozen<any[]>([])),
        codeListMap: types.map(types.union(types.frozen<CodeList>())),
    })
    /* eslint-disable no-param-reassign */
    .views((self) => {
        return {
            getCodeList(source: string, filterCondition?: FilterCondition): CodeList[] {
                const options = self.codeListMap.get(source);
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
        const fetchCodeListSuccess = ({ res }: { res: AxiosResponse<CodeListMap> }) => {
            // selection options
            self.loading = false;
            self.codeListMap.replace(res.data);
        };

        // eslint-disable-next-line require-yield,func-names
        const getLatestCodeList = flow(function* (source: string) {
            try {
                const res = yield fetchCodeListByCode(source).toPromise();
                const options = res?.data || [];
                self.codeListMap.set(source, options);
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
