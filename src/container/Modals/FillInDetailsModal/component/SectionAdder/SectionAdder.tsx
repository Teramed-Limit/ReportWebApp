import React, { useState } from 'react';

import Button from '@mui/material/Button';

import classes from './SectionAdder.module.scss';
import BaseTextInput from '../../../../../components/UI/BaseTextInput/BaseTextInput';
import { FormControl } from '../../../../../interface/form-state';
import FormSectionField from '../../../../../layout/FormSectionField/FormSectionField';
import { isEmptyOrNil } from '../../../../../utils/general';
import FormSectionFieldLabel from '../../../../Report/layout-container/FormSectionFieldLabel/FormSectionFieldLabel';

interface Props {
    itemNameList: string[];
    isDragging: boolean;
    onAddSection: (value: string) => void;
}

const initialInputState: FormControl = {
    isDirty: false,
    isValid: false,
    errorMessage: '',
    fromModal: '',
};

const SectionAdder = ({ itemNameList, isDragging = false, onAddSection }: Props) => {
    const [inputValue, setInputValue] = useState('');
    const [inputState, setInputState] = useState<FormControl>(initialInputState);

    const validate = (value: string) => {
        let isValid = false;
        let errorMessage = 'This field cannot empty';
        if (!isEmptyOrNil(value)) {
            isValid = !itemNameList.includes(value);
            errorMessage = isValid ? '' : 'Duplicate name';
        }
        return { isValid, errorMessage };
    };

    const onValueChange = (value: string) => {
        const { isValid, errorMessage } = validate(value);
        setInputState({
            ...inputState,
            isDirty: true,
            isValid,
            errorMessage,
        });
        setInputValue(value);
    };

    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const { isValid } = validate(event.currentTarget.defaultValue);
            onValueChange(event.currentTarget.defaultValue);
            if (isValid) {
                onAddSection(event.currentTarget.defaultValue);
                setInputValue('');
                setInputState(initialInputState);
            }
        }
    };

    return (
        <div style={{ display: isDragging ? 'none' : '' }} className={classes.item}>
            {/* Label */}
            <FormSectionFieldLabel id="sectionAdder" label="Name" hasValidation orientation="row" />
            {/* Value */}
            <FormSectionField
                id="sectionAdder"
                readOnly={false}
                orientation="row"
                isDirty={inputState.isDirty}
                isValid={inputState.isValid}
                errorMessage={inputState.errorMessage}
                disabled={false}
                noBorder={false}
                fieldComponent={
                    <BaseTextInput
                        value={inputValue}
                        onValueChange={onValueChange}
                        onKeyPress={onKeyPress}
                    />
                }
            />
            <Button
                disabled={!inputState.isValid}
                variant="contained"
                size="small"
                color="secondary"
                className={classes.btn}
                onClick={() => {
                    onAddSection(inputValue);
                    setInputState(initialInputState);
                    setInputValue('');
                }}
            >
                Add
            </Button>
        </div>
    );
};

export default React.memo(SectionAdder);
