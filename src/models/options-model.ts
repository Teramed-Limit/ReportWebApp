import { getRoot, Instance, types } from 'mst-effect';

import { FilterCondition } from '../interface/selection-field';

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
    });

export type OptionStore = Instance<typeof OptionStoreModel>;
