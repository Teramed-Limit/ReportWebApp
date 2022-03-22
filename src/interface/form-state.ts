export interface FormState {
    [prop: string]: FormControl;
}

export interface FormControl {
    isDirty: boolean;
    isValid: boolean;
    errorMessage: string;
    fromModal: string;
}
