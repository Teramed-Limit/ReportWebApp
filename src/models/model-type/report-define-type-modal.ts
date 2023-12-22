import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IModelType, Instance, IOptionalIType, ISimpleType, IType } from 'mst-effect';

import { FormDefine, FormDefineMap } from '../../interface/define';
import { DocumentData } from '../../interface/document-data';
import { Field } from '../../interface/report-field/field';
import { SRTreeNode } from '../../interface/sr-tree';

interface ReportDefineTypeOfModal extends ModelProperties {
    loading: IOptionalIType<ISimpleType<boolean>, [undefined]>;
    formDefineMap: IType<FormDefineMap | null | undefined, FormDefineMap, FormDefineMap>;
    formDefine: IOptionalIType<ISimpleType<FormDefine>, [undefined]>;
    imageDefine: IOptionalIType<ISimpleType<Field[]>, [undefined]>;
    normalizeFields: IOptionalIType<ISimpleType<{ [props: string]: Field }>, [undefined]>;
    normalizeSRFields: IOptionalIType<ISimpleType<{ [props: string]: Field }>, [undefined]>;
}

interface ReportDefineTypeOfActions {
    setFormDefine: (formData: DocumentData) => void;
    parseSR: (srTreeNode: SRTreeNode) => {
        [props: string]: string | number;
    };
    fetchDefine: () => void;
    fetchHistoryDefine: ({ studyInstanceUID, version }) => void;
}

export type ReportDefineTypeOfModel = ReportDefineTypeOfModal & ReportDefineTypeOfActions;

export type ReportDefineModal = IModelType<
    ReportDefineTypeOfModal,
    ReportDefineTypeOfActions,
    any,
    any
>;

export type DefineStore = Instance<ReportDefineModal>;
