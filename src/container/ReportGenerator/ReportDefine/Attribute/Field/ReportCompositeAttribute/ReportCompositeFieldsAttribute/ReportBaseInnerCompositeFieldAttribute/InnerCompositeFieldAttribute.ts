import { Style } from '@react-pdf/types/style';

import { InnerCompositeField } from '../../../../../../../../interface/report-field/composite-field';
import { ButtonMeta } from '../../../../../../../../interface/report-field/field';
import { Validate, ValidateType } from '../../../../../../../../interface/validate';
import { FormFieldType } from '../../../../../../../Report/FieldComponent/field-type';
import { CSSStyle } from '../../../../Common/Complex/ReportCSSStyleAttribute/CSSStyle';

export class InnerCompositeFieldAttribute implements InnerCompositeField {
    id: string;
    labelWidth: string;
    type: FormFieldType;
    readOnly: boolean;
    initMapping?: string;
    validate?: Validate;
    orientation: 'column' | 'row';
    valueStyle: Style;
    buttonBar?: ButtonMeta[];

    constructor(field: InnerCompositeField) {
        this.id = field.id || `InnerField-${new Date().getTime()}`;
        this.type = field.type;
        this.labelWidth = '0%';
        this.readOnly = field.readOnly || false;
        this.initMapping = field.initMapping || '';
        this.validate = field.validate || { type: ValidateType.None };
        this.orientation = field.orientation || 'row';
        this.valueStyle = field.valueStyle || new CSSStyle();
        this.buttonBar = field.buttonBar || [];
    }
}
