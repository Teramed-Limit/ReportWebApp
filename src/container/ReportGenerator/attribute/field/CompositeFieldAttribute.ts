import { CompositeField } from '../../../../interface/composite-field';
import { Field } from '../../../../interface/field';
import { FieldAttribute } from './FieldAttribute';

export class CompositeFieldAttribute extends FieldAttribute implements CompositeField {
    compositeOrientation: 'column' | 'row';
    fields: Field[];

    constructor(field: CompositeField) {
        super(field);

        this.compositeOrientation = field.compositeOrientation || 'row';
        this.fields = field.fields || [];
    }
}
