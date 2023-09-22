import { Validate, ValidateParams, ValidateType } from '../../../../../../../interface/validate';

export class ValidateAttribute implements Validate {
    type: ValidateType;
    params?: ValidateParams;

    constructor(validate: Validate) {
        this.type = validate?.type || ValidateType.None;
        this.params = validate?.params || undefined;
    }
}
