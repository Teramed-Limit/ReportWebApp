import { Validate, ValidateParams, ValidateType } from '../../../../interface/validate';
import { ValidateAttribute } from './ValidateAttribute';

export class RequiredValidateAttribute extends ValidateAttribute implements Validate {
    type: ValidateType;
    params: ValidateParams;

    constructor() {
        super();
        this.type = ValidateType.Required;
        this.params = {};
    }
}
