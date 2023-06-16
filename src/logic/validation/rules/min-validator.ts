import { RequireValidator } from './require-validator';
import { DocumentData } from '../../../interface/document-data';

export class MinValidator extends RequireValidator {
    errorMessage = 'Value should bigger than ';

    validate(value: any, validateParams: { min: number }, documentData: DocumentData) {
        if (!super.validate(value, validateParams, documentData)) {
            return {
                isValid: false,
                errorMessage: 'This field is required',
            };
        }

        if (validateParams.min >= value) {
            return {
                isValid: false,
                errorMessage: `${this.errorMessage} ${validateParams.min}`,
            };
        }

        return {
            isValid: true,
            errorMessage: '',
        };
    }
}
