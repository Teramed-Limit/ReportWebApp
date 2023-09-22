import { OptionSource } from '../../../../../../../interface/report-field/selection-field';

export class OptionSourceAttribute implements OptionSource<any> {
    type: string;
    source: string;
    labelKey?: string;
    key?: string;
    params?: any;

    constructor(value: OptionSource<any>) {
        this.type = value.type || 'http';
        this.source = value.source || 'ReportTemplate';
        this.labelKey = value.labelKey || undefined;
        this.key = value.key || undefined;
        this.params = value.params || undefined;
    }
}
