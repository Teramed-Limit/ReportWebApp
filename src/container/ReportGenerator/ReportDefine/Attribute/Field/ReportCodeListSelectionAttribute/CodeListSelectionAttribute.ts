import {
    FilterCondition,
    OptionSource,
    SelectionField,
} from '../../../../../../interface/report-field/selection-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class CodeListSelectionAttribute extends FieldAttribute implements SelectionField {
    isMulti?: boolean;
    optionSource: OptionSource<any>;
    filterCondition: FilterCondition;
    type = FormFieldType.CodeListSelection;
    joinStr?: string;
    fetchLatest?: boolean;

    constructor(field: SelectionField) {
        super(field);

        this.isMulti = field.isMulti || false;
        this.joinStr = field.joinStr || ',';
        this.fetchLatest = field.fetchLatest || false;
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
