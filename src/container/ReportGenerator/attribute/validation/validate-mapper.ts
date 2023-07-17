import { MinValidateAttribute } from './MinValidateAttribute';
import { RequiredValidateAttribute } from './RequiredValidateAttribute';
import { ValidateType } from '../../../../interface/validate';

export const ValidateAttributeMapper = {
    [ValidateType.Required]: () => new RequiredValidateAttribute(),
    [ValidateType.Min]: () => new MinValidateAttribute(),
};
