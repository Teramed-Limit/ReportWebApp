import { DocumentData } from '../../../interface/document-data';
import { ValidateResult } from '../../../interface/validator';
import { MinValidator } from './min-validator';

export class QualityBowelMinValidator extends MinValidator {
    errorMessage = 'Value should bigger than ';

    validate(
        value: any,
        validateParams: { min: number },
        documentData: DocumentData,
    ): ValidateResult {
        if (documentData?.ReportTemplate === 'Colonoscopy') {
            return super.validate(value, validateParams, documentData);
        }
        return {
            isValid: true,
            errorMessage: '',
        };
    }
}
