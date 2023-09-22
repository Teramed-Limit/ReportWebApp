import { LexiconField } from '../../../../../../interface/report-field/lexicon-field';
import {
    FilterCondition,
    OptionSource,
} from '../../../../../../interface/report-field/selection-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class CodeListLexiconAttribute extends FieldAttribute implements LexiconField<any> {
    optionSource: OptionSource<any>;
    filterCondition: FilterCondition;
    maxLength: number;
    type = FormFieldType.CodeListLexicon;

    constructor(field: LexiconField<any>) {
        super(field);

        this.maxLength = field.maxLength || 1000;
        this.optionSource = field?.optionSource || {
            type: 'http',
            source: 'ReportTemplate',
        };
        this.filterCondition = field.filterCondition || {
            filterById: '',
            filterOptionKey: '',
        };
    }
}
