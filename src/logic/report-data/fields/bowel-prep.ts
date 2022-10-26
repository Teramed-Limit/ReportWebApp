import { DocumentData } from '../../../interface/document-data';
import { FormControl } from '../../../interface/form-state';
import { ReportField } from '../../../interface/report-data';

export class BowelPrep extends ReportField {
    postValueChanged = (
        data: DocumentData,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ) => {
        let summary = '';
        if (data.QualityOfBowelPreparation === 'Adequate') {
            summary = `Good (Clean with slight feaculent fluid)`;
        } else {
            summary = `Poor (Solid faces which obscure view)`;
        }
        changeValue(
            'OtherDescription',
            `${summary}\r\nBPPS ${data.BBPS_Right}+${data.BBPS_Transverse}+${data.BBPS_Left}`,
        );
    };
}
