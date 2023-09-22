import { Style } from '@react-pdf/types/style';

import { ButtonMeta, Field } from '../../../../../../interface/report-field/field';
import { Validate, ValidateType } from '../../../../../../interface/validate';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import { CSSStyle } from '../../Common/Complex/ReportCSSStyleAttribute/CSSStyle';

export class FieldAttribute implements Field {
    id: string;
    type: FormFieldType;
    label?: string;
    labelWidth: string;
    labelStyle?: Style;
    valueStyle?: Style;
    defaultValue?: string;
    initMapping?: string;
    orientation: 'column' | 'row';
    readOnly?: boolean;
    buttonBar?: ButtonMeta[];
    validate?: Validate;
    hint?: string;
    hideLabel?: boolean;
    fromModal?: string;

    constructor(field: Field) {
        this.id = field.id || `Field-${new Date().getTime()}`;
        this.label = field.label || '';
        this.labelWidth = field.labelWidth || '35%';
        this.initMapping = field.initMapping || '';
        this.defaultValue = field.defaultValue || '';
        this.type = field.type || FormFieldType.Text;
        this.readOnly = field?.readOnly || false;
        this.orientation = field.orientation || 'row';
        this.buttonBar = field?.buttonBar || [];
        this.validate = field.validate || { type: ValidateType.None };
        this.hint = field?.hint || '';
        this.hideLabel = field?.hideLabel || false;
        this.fromModal = field?.fromModal || '';
        this.labelStyle = field?.labelStyle || new CSSStyle();
        this.valueStyle = field?.valueStyle || new CSSStyle();
    }
}
