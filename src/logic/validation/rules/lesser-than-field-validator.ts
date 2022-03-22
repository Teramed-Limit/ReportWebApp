import { DocumentData } from '../../../interface/document-data';
import { Validator } from '../../../interface/validator';

export class LesserThanFieldValidator extends Validator {
    errorMessage = 'Time end should not earlier than time start.';

    validate(value: number, validateParams: { fieldId: string }, documentData: DocumentData) {
        if (+value > +documentData[validateParams.fieldId]) {
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
