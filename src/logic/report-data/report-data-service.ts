import { BowelPrep } from './fields/bowel-prep';
import { ReportTemplate } from './fields/report-template';
import { FormDefine } from '../../interface/define';
import { DocumentData } from '../../interface/document-data';
import { FormControl } from '../../interface/form-state';
import { ReportField } from '../../interface/report-data';
import { ReportInjector } from '../../interface/report-injector';

export class ReportDataService implements ReportInjector {
    report: ReportField | undefined;

    factoryMapper = new Map<string, ReportField>();

    constructor() {
        this.factoryMapper.set('ReportTemplate', new ReportTemplate());
        this.factoryMapper.set('QualityOfBowelPreparation', new BowelPrep());
        this.factoryMapper.set('BBPS_Right', new BowelPrep());
        this.factoryMapper.set('BBPS_Transverse', new BowelPrep());
        this.factoryMapper.set('BBPS_Left', new BowelPrep());
    }

    inject(id: string) {
        this.report = this.factoryMapper.get(id);
    }

    postValueChanged(
        data: DocumentData,
        define: FormDefine,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ) {
        this.report?.postValueChanged(data, define, changeValue);
    }
}
