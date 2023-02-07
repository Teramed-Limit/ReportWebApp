import { Validate, ValidateType } from '../../../../interface/validate';

export class ValidateAttribute implements Validate {
    type: ValidateType = ValidateType.Required;
}
