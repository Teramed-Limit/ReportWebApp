import { Action, Condition } from './action';
import { DocumentData } from '../../../interface/document-data';
import { Field, ValueChangedEvent } from '../../../interface/report-field/field';
import { checkCondition } from '../../condition-matcher';

interface ChangeOtherValueActionParam {
    // 若此下列條件成立
    condition: Condition[];
    // 更改此Id的值
    targetId: string;
    targetValue: string;
}

export class ChangeOtherValueEvent extends Action<ChangeOtherValueActionParam[]> {
    name = 'ChangeOtherValue';
    execute = (
        params: {
            // 變動的Field Id
            id: string;
            // 變動的Field
            field: Field;
            // 變動的Value
            value: any;
            data: DocumentData;
            define: Record<string, Field>;
        },
        valueChangedEvent: ValueChangedEvent<ChangeOtherValueActionParam[]>,
        changeValue: (...args) => void,
    ) => {
        valueChangedEvent.eventParams.forEach((param) => {
            const conditions = param.condition;

            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                if (checkCondition(condition.type, params.value, condition.value)) {
                    changeValue(param.targetId, param.targetValue);
                    break;
                }
            }
        });
    };
}
