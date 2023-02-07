import { Validate, ValidateParams, ValidateType } from '../../../../interface/validate';
import { ValidateAttribute } from './ValidateAttribute';

export class MinValidateAttribute extends ValidateAttribute implements Validate {
    type: ValidateType;
    params: ValidateParams;

    constructor() {
        super();
        this.type = ValidateType.Min;
        this.params = { min: 0 };
    }
}
