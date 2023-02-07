import { ImageField, ImageSource } from '../../../../interface/image-field';
import { FormFieldType } from '../../../Report/field/field-type';
import { FieldAttribute } from './FieldAttribute';

export class ReportDiagramFieldAttribute extends FieldAttribute implements ImageField {
    imageSource: ImageSource;
    type = FormFieldType.ReportDiagram;

    constructor(field: ImageField) {
        super(field);
        this.imageSource = field.imageSource || { type: 'base64' };
    }
}
