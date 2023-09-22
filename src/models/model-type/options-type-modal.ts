import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IAnyType, IMapType, IModelType, Instance, IOptionalIType, ISimpleType } from 'mst-effect';
import { Observable } from 'rxjs';

import { CodeList, CodeListMap } from '../../interface/code-list';
import { FilterCondition, OptionSource } from '../../interface/report-field/selection-field';

interface OptionTypeOfProps extends ModelProperties {
    // optionMap: IMapType<IType<any[] | undefined | null, any[], any[]>>;
    loading: IOptionalIType<ISimpleType<unknown>, [undefined]>;
    codeListMap: IMapType<IAnyType>;
}

interface OptionTypeOfActions {
    getCodeList(optionSource: OptionSource<any>, filterCondition?: FilterCondition): CodeList[];

    getLatestCodeList(source: OptionSource<any>, filterCondition?: FilterCondition);

    initializeCodeList: <T = unknown>(
        payload?: undefined,
        handler?: (result$: Observable<unknown>) => Observable<T>,
    ) => Promise<T | undefined>;
    setCodeListMap: (data: CodeListMap) => void;
}

export type OptionType = OptionTypeOfProps & OptionTypeOfActions;

export type OptionsModal = IModelType<OptionTypeOfProps, OptionTypeOfActions, any, any>;

export type OptionStore = Instance<OptionsModal>;
