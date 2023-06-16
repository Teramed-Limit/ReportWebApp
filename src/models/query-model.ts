import { types } from 'mst-effect';

import { StudyData } from '../interface/study-data';

export const QueryModel = types
    .model('query', {
        queryResult: types.frozen<StudyData[]>([]),
        queryPairData: types.frozen({}),
    })
    /* eslint-disable no-param-reassign */
    .actions((self) => {
        const onConditionChanged = (value: any, fieldId: string) => {
            self.queryPairData = { ...self.queryPairData, [fieldId]: value };
        };

        const onResultChanged = (data: StudyData[]) => {
            self.queryResult = data;
        };

        return {
            onResultChanged,
            onConditionChanged,
        };
    });
