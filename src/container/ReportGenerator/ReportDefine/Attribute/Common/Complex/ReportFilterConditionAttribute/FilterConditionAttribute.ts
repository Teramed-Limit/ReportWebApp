import { FilterCondition } from '../../../../../../../interface/report-field/selection-field';

export class FilterConditionAttribute implements FilterCondition {
    filterById: string;
    filterOptionKey: string;

    constructor(value: FilterCondition) {
        this.filterById = value.filterById || '';
        this.filterOptionKey = value.filterOptionKey || '';
    }
}
