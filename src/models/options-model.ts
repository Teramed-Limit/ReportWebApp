import { flow, getRoot, IAnyModelType, types } from 'mobx-state-tree';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { OptionsModal } from './model-type/options-type-modal';
import { deleteCodeListByCodeName, fetchCodeList, fetchCodeListByCode } from '../axios/api';
import { staticOptionType } from '../constant/static-options';
import { CodeList } from '../interface/code-list';
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
            getExcludeCodeListMap(excludeList?: string[]) {
                const codeListMap = self.codeListMap.toJSON();
                if (excludeList) {
                    const result = {};
                    // 根據excludeList過濾codeListMap
                    Object.keys(codeListMap).forEach((key) => {
                        if (!excludeList.includes(key)) {
                            result[key] = codeListMap[key];
                        }
                    });
                    return result;
                }
                return codeListMap;
            },
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
        return {
            // 程式初始化時，先取得所有的codeList
            fetchCodeList: flow(function* (excludeList?: string[]) {
                try {
                    self.loading = true;
                    const res = yield fetchCodeList(excludeList).toPromise();
                    self.loading = false;
                    self.codeListMap.replace(res.data);
                } catch (error) {
                    console.error('Failed to fetch codeList,', error);
                    self.loading = false;
                }
            }),
            // 立即取得最新的codeList
            fetchLatestCodeList: flow(function* (optionSource: OptionSource<any>) {
                try {
                    const res = yield fetchCodeListByCode(optionSource.source).toPromise();
                    const options = res?.data || [];
                    self.codeListMap.set(optionSource.source, options);
                } catch (error) {
                    console.error(error);
                }
            }),
            // 刪除codeList
            deleteCodeList: flow(function* (codeName: string) {
                try {
                    self.loading = true;
                    const result = yield from(deleteCodeListByCodeName(codeName))
                        .pipe(concatMap(() => fetchCodeList()))
                        .toPromise();

                    self.codeListMap.replace(result.data);
                    self.loading = false;
                } catch (error) {
                    self.loading = false;
                    console.error(error);
                }
            }),
        };
    });
