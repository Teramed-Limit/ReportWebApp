import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IModelType, Instance, IType } from 'mst-effect';

import { StudyData } from '../../interface/study-data';

interface QueryTypeOfModal extends ModelProperties {
    queryResult: IType<StudyData[] | null | undefined, StudyData[], StudyData[]>;
    queryPairData: IType<
        NonNullable<unknown> | null | undefined,
        NonNullable<unknown>,
        NonNullable<unknown>
    >;
}

interface QueryTypeOfActions {
    onConditionChanged: (value: any, fieldId: string) => void;
    onResultChanged: (data: StudyData[]) => void;
}

export type QueryTypeModal = IModelType<QueryTypeOfModal, QueryTypeOfActions, any, any>;

export type QueryStore = Instance<QueryTypeModal>;
