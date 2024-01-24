import { CurveChartField } from '../../../../../../interface/report-field/curve-chart-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { FieldAttribute } from '../ReportBaseFieldAttribute/FieldAttribute';

export class CurveChartAttribute extends FieldAttribute implements CurveChartField {
    width: string;
    height: string;
    chartType: string;
    type = FormFieldType.OBGYNChart;

    constructor(field: CurveChartField) {
        super(field);
        this.width = field.width || '100%';
        this.height = field.height || '300px';
        this.chartType = field.chartType || 'BPD';
    }
}
