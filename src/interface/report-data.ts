import { DocumentData } from './document-data';
import { FormControl } from './form-state';

export abstract class ReportField {
    abstract postValueChanged(
        data: DocumentData,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    );
}
