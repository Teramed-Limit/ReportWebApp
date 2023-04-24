import { Action, Condition } from './action';
import { FormControl } from '../../../interface/form-state';
import { checkCondition } from '../../condition-matcher';

interface RadioButtonActionParam {
    condition: Condition[];
    targetId: string;
    targetValue: string;
}

export class RadioButtonChangeOtherValueEvent extends Action<RadioButtonActionParam[]> {
    execute = (
        actionParams: RadioButtonActionParam[],
        value: string,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    ) => {
        actionParams.forEach((param) => {
            const conditions = param.condition;

            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                if (checkCondition(condition.type, value, condition.value)) {
                    changeValue(param.targetId, param.targetValue);
                    break;
                }
            }
        });
    };
}
