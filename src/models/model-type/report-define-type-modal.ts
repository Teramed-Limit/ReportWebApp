import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IMapType, IModelType, Instance, IOptionalIType, ISimpleType, IType } from 'mst-effect';
import { Observable } from 'rxjs';

import { FormDefine, FormDefineMap } from '../../interface/define';
import { DocumentData } from '../../interface/document-data';

interface ReportDefineTypeOfModal extends ModelProperties {
    loading: IOptionalIType<ISimpleType<boolean>, [undefined]>;
    formDefineMap: IType<FormDefineMap | null | undefined, FormDefineMap, FormDefineMap>;
    formDefine: IOptionalIType<ISimpleType<FormDefine>, [undefined]>;
    pdfDefine: IOptionalIType<ISimpleType<FormDefine>, [undefined]>;
    normalizeFields: IMapType<IType<any, any, any>>;
}

interface ReportDefineTypeOfActions {
    setFormDefine: (formData: DocumentData) => void;
    fetchDefine: <T = unknown>(
        payload?: undefined,
        handler?: (result$: Observable<unknown>) => Observable<T>,
    ) => Promise<T | undefined>;
    fetchHistoryDefine: <T = any>(
        payload: {
            studyInstanceUID: string;
            version: string;
        },
        handler?: (result$: Observable<any>) => Observable<T>,
    ) => Promise<T | undefined>;
}

export type ReportDefineTypeOfModel = ReportDefineTypeOfModal & ReportDefineTypeOfActions;

export type ReportDefineModal = IModelType<
    ReportDefineTypeOfModal,
    ReportDefineTypeOfActions,
    any,
    any
>;

export type DefineStore = Instance<ReportDefineModal>;
