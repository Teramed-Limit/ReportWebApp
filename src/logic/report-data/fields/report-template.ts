import { FormDefine } from '../../../interface/define';
import { DocumentData } from '../../../interface/document-data';
import { FormControl } from '../../../interface/form-state';
import { ReportField } from '../../../interface/report-data';
import { emptyBaseImage } from '../../../utils/general';

export class ReportTemplate extends ReportField {
    execute = (
        data: DocumentData,
        define: FormDefine,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ) => {
        changeValue('Indication', '');
        changeValue('DiagramData', emptyBaseImage());
        changeValue('DiagramMarkers', []);

        if (define.modal?.modalName === 'colonoscopyQualityIndicators') {
            changeValue('QualityOfBowelPreparation', '', { isValid: false });
            changeValue('QualityBowelScore', 0, { isValid: false });
        } else {
            changeValue('Other', '');
            changeValue('OtherDescription', '');
            changeValue('OccurrenceofComplication', '');
            changeValue('PlannedforPartialColonoscopy', '');
            changeValue('BowelPreparation', '');
            changeValue('PostRighthemicolectomy', '');
            changeValue('TechnicalDifficulties', '');
            changeValue('MechanicalObstruction', '');
            changeValue('IsCaecumReached', '', { isValid: true });
            changeValue('WithdrawalTime', 0, { isValid: true });
            changeValue('QualityOfBowelPreparation', '', { isValid: true });
            changeValue('QualityBowelScore', 0, { isValid: true });
            changeValue('BBPS_Left', -1);
            changeValue('BBPS_Right', -1);
            changeValue('BBPS_Transverse', -1);
        }
    };
}
