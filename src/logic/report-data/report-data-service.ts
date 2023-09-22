import { Action } from './actions/action';
import { ChangeOtherArrayValueEvent } from './actions/change-other-array-value-event';
import { ChangeOtherValueEvent } from './actions/change-other-value-event';
import { BowelPrep } from './fields/bowel-prep';
import { ReportTemplate } from './fields/report-template';
import { FormDefine } from '../../interface/define';
import { DocumentData } from '../../interface/document-data';
import { FormControl } from '../../interface/form-state';
import { ReportField } from '../../interface/report-data';
import { Field } from '../../interface/report-field/field';

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
        this.actionContainer.set('ChangeOtherValue', new ChangeOtherValueEvent());
        this.actionContainer.set('ChangeOtherArrayValue', new ChangeOtherArrayValueEvent());
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
        params: {
            // 變動的Field Id
            id: string;
            // 變動的Field
            field: Field;
            // 變動的Value
            value: any;
            // 若為Array Field，Array Field Id
            arrayId?: string;
            // 若為Array Field，變動的Field Id
            arrayIdx?: number;
            data: DocumentData;
            define: Record<string, Field>;
        },
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ): void {
        if (!params.field?.valueChangedEvent) return;
        const actionFunction = this.actionContainer.get(params.field.valueChangedEvent.event);
        if (actionFunction) {
            actionFunction.execute(params, params.field.valueChangedEvent, changeValue);
        } else {
            console.error(
                `postValueChangedByAction error, 找不到對應的action, ${params.field.valueChangedEvent.event}`,
            );
        }
    }
}
