import { DiagramField } from '../../../../../../interface/report-field/diagram-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class ReportDiagramFieldAttribute extends FieldAttribute implements DiagramField {
    width?: string;
    height?: string;
    type = FormFieldType.ReportDiagram;

    constructor(field: DiagramField) {
        super(field);
        this.width = field.width || 'auto';
        this.height = field.height || 'auto';
        this.hideLabel = true;
    }
}
