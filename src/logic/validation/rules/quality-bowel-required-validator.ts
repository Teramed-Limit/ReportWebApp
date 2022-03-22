import { DocumentData } from '../../../interface/document-data';
import { ValidateParams } from '../../../interface/validate';
import { ValidateResult } from '../../../interface/validator';
import { RequireValidator } from './require-validator';

export class QualityBowelRequiredValidator extends RequireValidator {
    errorMessage = 'This field is required';

    validate(
        value: any,
        validateParams: ValidateParams,
        documentData: DocumentData,
    ): ValidateResult {
        if (documentData.ERSType === 'Colonoscopy') {
            return super.validate(value, validateParams, documentData);
        }
        return {
            isValid: true,
            errorMessage: '',
        };
    }
}
