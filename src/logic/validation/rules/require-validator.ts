import { DocumentData } from '../../../interface/document-data';
import { ValidateResult, Validator } from '../../../interface/validator';
import { isEmptyOrNil } from '../../../utils/general';

export class RequireValidator extends Validator {
    errorMessage = 'This field is required';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(value: any, validateParams: any, documentData: DocumentData): ValidateResult {
        return isEmptyOrNil(value)
            ? {
                  isValid: false,
                  errorMessage: this.errorMessage,
              }
            : {
                  isValid: true,
                  errorMessage: '',
              };
    }
}
