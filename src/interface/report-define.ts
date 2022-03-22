import { FormDefine } from './define';

export interface ReportDefineImp {
    getDefine: (define, data) => FormDefine;
}

export class ReportDefine implements ReportDefineImp {
    getDefine = (define): FormDefine => {
        return define;
    };
}
