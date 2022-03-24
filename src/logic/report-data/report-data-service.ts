import { DocumentData } from '../../interface/document-data';
import { FormControl } from '../../interface/form-state';
import { ReportField } from '../../interface/report-data';
import { ReportInjector } from '../../interface/report-injector';
import { ERSType } from './fields/ers-type';
import { ReportTemplate } from './fields/report-template';

export class ReportDataService implements ReportInjector {
    report: ReportField | undefined;

    factoryMapper = new Map<string, ReportField>();

    constructor() {
        this.factoryMapper.set('ERSType', new ERSType());
        this.factoryMapper.set('ReportTemplate', new ReportTemplate());
    }

    inject(id: string) {
        this.report = this.factoryMapper.get(id);
    }

    postValueChanged(
        data: DocumentData,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ) {
        this.report?.postValueChanged(data, changeValue);
    }
}
