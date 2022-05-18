import { getEnv, Instance, types } from 'mst-effect';

import { FormDefine } from '../interface/define';
import { DocumentData } from '../interface/document-data';
import { RootService } from '../interface/root-service';

export const DefineModel = types
    .model('define', {
        formDefine: types.optional(types.frozen<FormDefine>(), { sections: [] }),
        pdfDefine: types.optional(types.frozen<FormDefine>(), { sections: [] }),
        normalizeFields: types.map(types.frozen<any>()),
    })
    /* eslint-disable no-param-reassign */
    .actions((self) => {
        return {
            setFormDefine: (formData: DocumentData) => {
                const { reportDefineService } = getEnv<RootService>(self);
                self.formDefine = reportDefineService.switchFormDefine(formData).reportDefine;
                self.pdfDefine = reportDefineService.switchFormDefine(formData).pdfDefine;
            },
        };
    });

export type DefineStore = Instance<typeof DefineModel>;
