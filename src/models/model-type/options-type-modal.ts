import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IMapType, IModelType, Instance, IOptionalIType, ISimpleType, IType } from 'mst-effect';
import { Observable } from 'rxjs';

import { CodeList, CodeListMap } from '../../interface/code-list';
import { FilterCondition } from '../../interface/selection-field';

interface OptionTypeOfModal extends ModelProperties {
    optionMap: IMapType<IType<any[] | undefined | null, any[], any[]>>;
    loading: IOptionalIType<ISimpleType<unknown>, [undefined]>;
    codeListMap: IType<CodeListMap | undefined | null, CodeListMap, CodeListMap>;
}

interface OptionTypeOfActions {
    getOptions(source: string, filterCondition?: FilterCondition): any[];

    getCodeList(source: string, filterCondition?: FilterCondition): CodeList[];

    initializeCodeList: <T = unknown>(
        payload?: undefined,
        handler?: (result$: Observable<unknown>) => Observable<T>,
    ) => Promise<T | undefined>;
    setCodeListMap: (data: CodeListMap) => void;
}

export type OptionsModal = IModelType<OptionTypeOfModal, OptionTypeOfActions, any, any>;

export type OptionStore = Instance<OptionsModal>;
