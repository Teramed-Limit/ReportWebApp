import { ArrayField } from '../../../../interface/array-field';
import { Field } from '../../../../interface/field';
import { FieldAttribute } from './FieldAttribute';

export class ArrayFieldAttribute extends FieldAttribute implements ArrayField {
    templateField: Field;

    constructor(field: ArrayField) {
        super(field);

        this.templateField = field.templateField;
    }
}
