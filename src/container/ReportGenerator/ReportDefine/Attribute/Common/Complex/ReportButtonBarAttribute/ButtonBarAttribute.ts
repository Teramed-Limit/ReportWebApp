import { ButtonMeta } from '../../../../../../../interface/report-field/field';

export class ButtonBarAttribute implements ButtonMeta {
    id: string;
    label: string;
    action: string;
    actionParams?: any;
    hide?: boolean;
    disable?: boolean;

    constructor(buttonMeta?: ButtonMeta) {
        this.id = buttonMeta?.id || '';
        this.label = buttonMeta?.label || '';
        this.action = buttonMeta?.action || '';
        this.actionParams = buttonMeta?.actionParams || '';
        this.hide = buttonMeta?.hide || false;
        this.disable = buttonMeta?.disable || false;
    }
}
