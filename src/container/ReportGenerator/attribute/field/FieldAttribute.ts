import { Style } from '@react-pdf/types/style';

import { ButtonMeta, Field } from '../../../../interface/field';
import { Validate } from '../../../../interface/validate';
import { generateUUID } from '../../../../utils/general';
import { FormFieldType } from '../../../Report/field/field-type';
import { CSSStyle } from '../style/CSSStyle';

export class FieldAttribute implements Field {
    id: string;
    label?: string;
    type: FormFieldType;
    readOnly: boolean;
    orientation: 'column' | 'row';
    buttonBar?: ButtonMeta[];
    validate?: Validate;
    hint: string;
    hide: boolean;
    hideLabel: boolean;
    fromModal: string;
    labelStyle: Style;
    valueStyle: Style;

    constructor(field: Field) {
        this.id = field.id || generateUUID();
        this.label = field.label || 'Label';
        this.type = field.type || FormFieldType.Text;
        this.readOnly = field.readOnly || false;
        this.orientation = field.orientation || 'row';
        this.buttonBar = field.buttonBar || undefined;
        this.validate = field.validate || undefined;
        this.hint = field.hint || '';
        this.hide = field.hide || false;
        this.hideLabel = field.hideLabel || false;
        this.fromModal = field.fromModal || '';
        this.labelStyle = field.labelStyle || new CSSStyle();
        this.valueStyle = field.valueStyle || new CSSStyle();
    }
}
