import { DocumentData } from '../../../interface/document-data';
import { Validator } from '../../../interface/validator';

export class GreaterThanFieldValidator extends Validator {
    errorMessage = 'Time start should not later than time end.';

    validate(value: number, validateParams: { fieldId: string }, documentData: DocumentData) {
        if (+value < +documentData[validateParams.fieldId]) {
            return {
                isValid: false,
                errorMessage: this.errorMessage,
            };
        }

        return {
            isValid: true,
            errorMessage: '',
        };
    }
}
