import { DocumentData } from '../../../interface/document-data';
import { FormControl } from '../../../interface/form-state';
import { ReportField } from '../../../interface/report-data';

export class EndTimeHour extends ReportField {
    postValueChanged = (
        data: DocumentData,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ) => {
        changeValue('StartTimeHour', data.StartTimeHour);
    };
}
