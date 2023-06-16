import * as R from 'ramda';

import { Action, Condition } from './action';
import { DocumentData } from '../../../interface/document-data';
import { Field, ValueChangedEvent } from '../../../interface/field';
import { checkCondition } from '../../condition-matcher';

interface ChangeOtherValueActionParam {
    condition: Condition[];
    targetId: string;
    targetValue: string;
}

export class ChangeOtherArrayValueEvent extends Action<ChangeOtherValueActionParam[]> {
    name = 'ChangeOtherArrayValue';
    execute = (
        params: {
            // 變動的Field Id
            id: string;
            // 變動的Field
            field: Field;
            // 變動的Value
            value: any;
            // 若為Array Field，Array Field Id
            arrayId: string;
            // 若為Array Field，變動的Field Id
            arrayIdx: number;
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
                    const value = R.assocPath(
                        [params.arrayIdx, param.targetId],
                        param.targetValue,
                        params.data[params.id],
                    );
                    changeValue(params.id, value);
                    break;
                }
            }
        });
    };
}
