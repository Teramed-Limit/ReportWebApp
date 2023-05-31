import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IModelType, Instance } from 'mst-effect';

import { AuthTypeModal } from './auth-type-modal';
import { ImagesModal } from './image-type-modal';
import { OptionsModal } from './options-type-modal';
import { QueryTypeModal } from './query-type-modal';
import { ReportDataModal } from './report-data-type-modal';
import { ReportDefineModal } from './report-define-type-modal';

export interface RootTypeOfModal extends ModelProperties {
    authStore: AuthTypeModal;
    optionStore: OptionsModal;
    dataStore: ReportDataModal;
    defineStore: ReportDefineModal;
    imageStore: ImagesModal;
    queryStore: QueryTypeModal;
}

export type RootTypeModal = IModelType<RootTypeOfModal, any, any, any>;

export type RootStore = Instance<RootTypeModal>;
