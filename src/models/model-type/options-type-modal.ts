import { IKeyValueMap } from 'mobx';
import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IAnyType, IMapType, IModelType, Instance, IOptionalIType, ISimpleType } from 'mst-effect';

import { CodeList } from '../../interface/code-list';
import { FilterCondition, OptionSource } from '../../interface/report-field/selection-field';

interface OptionTypeOfProps extends ModelProperties {
    loading: IOptionalIType<ISimpleType<unknown>, [undefined]>;
    codeListMap: IMapType<IAnyType>;
}

interface OptionTypeOfActions {
    // View
    // 根據optionSource取得codeList
    getExcludeCodeListMap(excludeList?: string[]): IKeyValueMap<CodeList[]>;
    getCodeList(optionSource: OptionSource<any>, filterCondition?: FilterCondition): CodeList[];

    // Action
    // 立即更新最新的codeList
    fetchLatestCodeList(source: OptionSource<any>, filterCondition?: FilterCondition): void;

    // 程式初始化時，先取得所有的codeList
    fetchCodeList(excludeList?: string[]): void;

    // 刪除codeList
    deleteCodeList(codeName: string): void;
}

export type OptionType = OptionTypeOfProps & OptionTypeOfActions;

export type OptionsModal = IModelType<OptionTypeOfProps, OptionTypeOfActions, any, any>;

export type OptionStore = Instance<OptionsModal>;
