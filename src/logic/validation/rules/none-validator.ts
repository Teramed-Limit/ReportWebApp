import { DocumentData } from '../../../interface/document-data';
import { ValidateResult, Validator } from '../../../interface/validator';

export class NoneValidator extends Validator {
    errorMessage = '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(value: any, validateParams: any, documentData: DocumentData): ValidateResult {
        return {
            isValid: true,
            errorMessage: '',
        };
    }
}
