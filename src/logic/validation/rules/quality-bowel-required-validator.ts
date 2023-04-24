import { RequireValidator } from './require-validator';
import { DocumentData } from '../../../interface/document-data';
import { ValidateParams } from '../../../interface/validate';
import { ValidateResult } from '../../../interface/validator';

export class QualityBowelRequiredValidator extends RequireValidator {
    errorMessage = 'This field is required';

    validate(
        value: any,
        validateParams: ValidateParams,
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
