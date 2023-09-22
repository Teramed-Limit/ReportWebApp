import { DocumentData } from '../../../interface/document-data';
import { Validator } from '../../../interface/validator';

export class NoneValidator extends Validator {
    errorMessage = '';

    validate(value: any, validateParams: any, documentData: DocumentData) {
        return {
            isValid: true,
            errorMessage: '',
        };
    }
}
