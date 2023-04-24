import { Action } from './actions/action';
import { RadioButtonChangeOtherValueEvent } from './actions/radio-button-change-other-value-event';
import { BowelPrep } from './fields/bowel-prep';
import { ReportTemplate } from './fields/report-template';
import { FormDefine } from '../../interface/define';
import { DocumentData } from '../../interface/document-data';
import { Field } from '../../interface/field';
import { FormControl } from '../../interface/form-state';
import { ReportField } from '../../interface/report-data';

export class ReportDataService {
    factoryMapper = new Map<string, ReportField>();
    actionContainer = new Map<string, Action>();

    constructor() {
        // By id
        this.factoryMapper.set('ReportTemplate', new ReportTemplate());
        this.factoryMapper.set('QualityOfBowelPreparation', new BowelPrep());
        this.factoryMapper.set('BBPS_Right', new BowelPrep());
        this.factoryMapper.set('BBPS_Transverse', new BowelPrep());
        this.factoryMapper.set('BBPS_Left', new BowelPrep());
        // By action
        this.actionContainer.set(
            'RadioButtonChangeOtherValue',
            new RadioButtonChangeOtherValueEvent(),
        );
    }

    postValueChangedById(
        id: string,
        data: DocumentData,
        define: FormDefine,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ) {
        const actionFunction = this.factoryMapper.get(id);
        if (actionFunction) {
            actionFunction.execute(data, define, changeValue);
        }
    }

    postValueChangedByAction(
        field: Field | undefined,
        value: string,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ): void {
        if (!field || !field?.valueChangedEvent) return;
        const actionFunction = this.actionContainer.get(field.valueChangedEvent.event);
        if (actionFunction) {
            actionFunction.execute(field.valueChangedEvent.eventParams, value, changeValue);
        } else {
            console.error(
                `postValueChangedByAction error, 找不到對應的action, ${field.valueChangedEvent.event}`,
            );
        }
    }
}
