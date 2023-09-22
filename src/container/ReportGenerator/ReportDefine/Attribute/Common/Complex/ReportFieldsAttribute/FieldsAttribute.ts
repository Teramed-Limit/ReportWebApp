import { Field } from '../../../../../../../interface/report-field/field';

export class FieldsAttribute {
    fields: Field[];

    constructor(value: Field[]) {
        this.fields = value || [];
    }
}
