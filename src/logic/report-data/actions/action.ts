import { FormControl } from '../../../interface/form-state';

export interface Condition {
    type: string;
    value: string;
}

export abstract class Action<T = any> {
    abstract execute(
        actionParams: T,
        value: string,
        changeValue: (id, value, state?: Partial<FormControl>) => void,
    );
}
