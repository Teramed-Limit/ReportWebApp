import { FieldAttribute } from './FieldAttribute';
import { ArrayField } from '../../../../interface/array-field';
import { Field } from '../../../../interface/field';

export class ArrayFieldAttribute extends FieldAttribute implements ArrayField {
    templateField: Field & {
        fields: Field[];
    };

    constructor(field: ArrayField) {
        super(field);

        this.templateField = field.templateField;
    }
}
