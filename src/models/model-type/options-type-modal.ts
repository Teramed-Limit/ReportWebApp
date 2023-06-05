import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IAnyType, IMapType, IModelType, Instance, IOptionalIType, ISimpleType } from 'mst-effect';
import { Observable } from 'rxjs';

import { CodeList, CodeListMap } from '../../interface/code-list';
import { FilterCondition } from '../../interface/selection-field';

interface OptionTypeOfModal extends ModelProperties {
    // optionMap: IMapType<IType<any[] | undefined | null, any[], any[]>>;
    loading: IOptionalIType<ISimpleType<unknown>, [undefined]>;
    codeListMap: IMapType<IAnyType>;
}

interface OptionTypeOfActions {
    getCodeList(source: string, filterCondition?: FilterCondition): CodeList[];
    getLatestCodeList(source: string, filterCondition?: FilterCondition);

    initializeCodeList: <T = unknown>(
        payload?: undefined,
        handler?: (result$: Observable<unknown>) => Observable<T>,
    ) => Promise<T | undefined>;
    setCodeListMap: (data: CodeListMap) => void;
}

export type OptionsModal = IModelType<OptionTypeOfModal, OptionTypeOfActions, any, any>;

export type OptionStore = Instance<OptionsModal>;
