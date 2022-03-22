import { DocumentData } from './document-data';

export interface ValidatorImp {
    errorMessage: string;
    validate: (value: any, validateParams: any, documentData: DocumentData) => ValidateResult;
}

export interface ValidateResult {
    isValid: boolean;
    errorMessage: string;
}

export class Validator implements ValidatorImp {
    errorMessage = '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(value: any, validateParams: any, documentData: DocumentData): ValidateResult {
        return {
            isValid: true,
            errorMessage: this.errorMessage,
        };
    }
}
