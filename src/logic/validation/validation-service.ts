import { MinValidator } from './rules/min-validator';
import { NoneValidator } from './rules/none-validator';
import { QualityBowelMinValidator } from './rules/quality-bowel-min-validator';
import { QualityBowelRequiredValidator } from './rules/quality-bowel-required-validator';
import { QualityBowelValidator } from './rules/quality-bowel-validator';
import { RequireValidator } from './rules/require-validator';
import { DocumentData } from '../../interface/document-data';
import { Validate, ValidateType } from '../../interface/validate';
import { ValidateResult, Validator } from '../../interface/validator';

export class ValidationService {
    validator: Validator | undefined;

    factoryMapper = new Map<string, Validator>();

    constructor() {
        this.factoryMapper.set(ValidateType.None, new NoneValidator());
        this.factoryMapper.set(ValidateType.Required, new RequireValidator());
        this.factoryMapper.set(ValidateType.Min, new MinValidator());
        this.factoryMapper.set(ValidateType.QualityBowelScore, new QualityBowelValidator());
        this.factoryMapper.set(
            ValidateType.QualityBowelRequired,
            new QualityBowelRequiredValidator(),
        );
        this.factoryMapper.set(ValidateType.QualityBowelMin, new QualityBowelMinValidator());
        // this.factoryMapper.set('greaterThanField', new GreaterThanFieldValidator());
        // this.factoryMapper.set('lesserThanField', new LesserThanFieldValidator());
    }

    validate = (value: any, rule: Validate, documentData: DocumentData): ValidateResult => {
        this.validator = this.factoryMapper.get(rule.type);
        if (!this.validator) {
            console.error(`validator: ${rule.type} not found`);
            return new Validator().validate(value, rule.params, documentData);
        }

        return this.validator.validate(value, rule.params, documentData);
    };
}
