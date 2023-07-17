import { ValidateAttribute } from './ValidateAttribute';
import { Validate, ValidateParams, ValidateType } from '../../../../interface/validate';

export class RequiredValidateAttribute extends ValidateAttribute implements Validate {
    type: ValidateType;
    params: ValidateParams;

    constructor() {
        super();
        this.type = ValidateType.Required;
        this.params = {};
    }
}
