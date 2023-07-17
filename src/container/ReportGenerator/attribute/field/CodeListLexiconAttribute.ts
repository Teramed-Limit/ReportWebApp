import { FieldAttribute } from './FieldAttribute';
import { LexiconField } from '../../../../interface/lexicon-field';
import { FilterCondition, OptionSource } from '../../../../interface/selection-field';
import { FormFieldType } from '../../../Report/field/field-type';

export class CodeListLexiconAttribute extends FieldAttribute implements LexiconField<any> {
    optionSource: OptionSource<any>;
    filterCondition: FilterCondition;
    maxLength: number;
    type = FormFieldType.CodeListLexicon;

    constructor(field: LexiconField<any>) {
        super(field);

        this.maxLength = field.maxLength || 1000;
        this.optionSource = field.optionSource || {
            type: 'http',
            source: 'string',
        };
        this.filterCondition = field.filterCondition || {
            filterById: '',
            filterOptionKey: '',
        };
    }
}
