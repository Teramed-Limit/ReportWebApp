import { FormDefine } from '../../../interface/define';
import { DocumentData } from '../../../interface/document-data';
import { FormControl } from '../../../interface/form-state';
import { ReportField } from '../../../interface/report-data';

export class BowelPrep extends ReportField {
    execute = (
        data: DocumentData,
        define: FormDefine,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ) => {
        let summary = '';
        if (data?.QualityOfBowelPreparation === 'Adequate') {
            summary = `Good (Clean with slight feaculent fluid)`;
        } else {
            summary = `Poor (Solid faces which obscure view)`;
        }
        changeValue(
            'OtherDescription',
            `${summary}\nBBPS ${data?.BBPS_Right}+${data?.BBPS_Transverse}+${data?.BBPS_Left}`,
        );
    };
}
