import { IAnyModelType, types } from 'mst-effect';

import { AuthModel } from './auth-model';
import { RootTypeModal } from './model-type/root-type-modal';
import { OptionStoreModel } from './options-model';
import { QueryModel } from './query-model';
import { DataModel } from './report-data-model';
import { DefineModel } from './report-define-model';
import { ImageModel } from './report-image-model';

export const RootStoreModel: RootTypeModal = types
    .model('root', {
        authStore: types.late((): IAnyModelType => AuthModel),
        optionStore: OptionStoreModel,
        dataStore: DataModel,
        defineStore: DefineModel,
        imageStore: ImageModel,
        queryStore: QueryModel,
    })
    /* eslint-disable no-param-reassign */
    .views((self) => ({
        get formDefine() {
            return self.defineStore.formDefine;
        },
        get formData() {
            return self.dataStore.formData;
        },
        get loading() {
            return self.dataStore.loading || self.optionStore.loading;
        },
    }))
    .actions((self) => {
        return {
            afterCreate() {
                // self.optionStore.initialize().then();
                self.optionStore.initializeCodeList().then();
                self.defineStore.fetchDefine().then();
            },
        };
    });
