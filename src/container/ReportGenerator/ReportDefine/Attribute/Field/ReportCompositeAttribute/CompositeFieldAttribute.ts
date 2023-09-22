import { Style } from '@react-pdf/types/style';

import { InnerCompositeFieldAttribute } from './ReportCompositeFieldsAttribute/ReportBaseInnerCompositeFieldAttribute/InnerCompositeFieldAttribute';
import { CompositeField } from '../../../../../../interface/report-field/composite-field';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { CSSStyle } from '../../Common/Complex/ReportCSSStyleAttribute/CSSStyle';

export class CompositeFieldAttribute implements CompositeField {
    id: string;
    label?: string;
    labelWidth: string;
    type: FormFieldType;
    orientation: 'column' | 'row';
    compositeOrientation: 'column' | 'row';
    hint?: string;
    hideLabel?: boolean;
    labelStyle?: Style;
    fields: InnerCompositeFieldAttribute[];

    constructor(field: CompositeField) {
        this.id = field.id || `CompositeField-${new Date().getTime()}`;
        this.label = field.label || '';
        this.labelWidth = field.labelWidth || '35%';
        this.type = field.type || FormFieldType.Text;
        this.orientation = field.orientation || 'row';
        this.compositeOrientation = field.compositeOrientation || 'column';
        this.hint = field.hint || '';
        this.hideLabel = field.hideLabel || false;
        this.labelStyle = field.labelStyle || new CSSStyle();
        this.fields = field.fields || [this.addField(1), this.addField(2)];
    }

    addField = (index: number) => {
        return new InnerCompositeFieldAttribute({
            id: `${this.id}_Child${index}`,
            labelWidth: '35%',
            type: FormFieldType.Text,
            readOnly: false,
            orientation: 'row',
            valueStyle: new CSSStyle(),
        });
    };
}
