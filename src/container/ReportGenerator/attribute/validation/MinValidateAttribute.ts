import { ValidateAttribute } from './ValidateAttribute';
import { Validate, ValidateParams, ValidateType } from '../../../../interface/validate';

export class MinValidateAttribute extends ValidateAttribute implements Validate {
    type: ValidateType;
    params: ValidateParams;

    constructor() {
        super();
        this.type = ValidateType.Min;
        this.params = { min: 0 };
    }
}
