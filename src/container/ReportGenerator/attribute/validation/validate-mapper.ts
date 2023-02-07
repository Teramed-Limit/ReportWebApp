import { ValidateType } from '../../../../interface/validate';
import { MinValidateAttribute } from './MinValidateAttribute';
import { RequiredValidateAttribute } from './RequiredValidateAttribute';

export const ValidateAttributeMapper = {
    [ValidateType.Required]: () => new RequiredValidateAttribute(),
    [ValidateType.Min]: () => new MinValidateAttribute(),
};
