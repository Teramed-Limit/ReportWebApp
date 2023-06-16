import { FormDefine } from './define';
import { DocumentData } from './document-data';
import { FormControl } from './form-state';

export abstract class ReportField {
    abstract execute(
        data: DocumentData,
        define: FormDefine,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    );
}
