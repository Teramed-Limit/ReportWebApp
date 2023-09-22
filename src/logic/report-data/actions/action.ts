import { DocumentData } from '../../../interface/document-data';
import { Field, ValueChangedEvent } from '../../../interface/report-field/field';

export interface Condition {
    type: string;
    value: string;
}

export abstract class Action<T = any> {
    abstract execute(
        params: {
            // 變動的Field Id
            id: string;
            // 變動的Field
            field: Field;
            // 變動的Value
            value: any;
            // 若為Array Field，變動的Field Id
            arrayIdx?: number;
            data: DocumentData;
            define: Record<string, Field>;
        },
        valueChangedEvent: ValueChangedEvent<T>,
        changeValue: (...args) => void,
    );
}
