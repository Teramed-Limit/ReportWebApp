import React, { useEffect, useRef } from 'react';

import { observer } from 'mobx-react';

import BaseSelection from '../../../../components/UI/BaseSelection/BaseSelection';
import { SelectionField } from '../../../../interface/selection-field';
import { useOptionStore } from '../../../../models/useStore';
import { coerceArray } from '../../../../utils/general';

interface SelectionProps {
    field: SelectionField<any>;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

const Selection = React.forwardRef(
    (
        {
            field,
            value: selectedOption,
            onValueChange: onSelectionChanged,
            disabled,
        }: SelectionProps,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ref,
    ) => {
        const { isMulti, optionSource, filterCondition } = field;
        const { labelKey = 'Name', key = 'Code', source } = optionSource;
        const selectedIsNotInOptions = useRef(false);

        useEffect(() => {
            if (selectedIsNotInOptions.current) {
                onSelectionChanged('');
                selectedIsNotInOptions.current = false;
            }
        });

        const options = useOptionStore()
            .getOptions(source, filterCondition)
            ?.map((option) => ({ ...option, value: option[key], label: option[labelKey] }));

        let formatValue = coerceArray(selectedOption);
        let formatSelectedOption;
        if (selectedOption && options) {
            formatValue = formatValue.map((str) => options.find((option) => option.label === str));

            // selectedOption does not in options
            formatSelectedOption = isMulti ? formatValue : formatValue[0];
            if (!formatSelectedOption && filterCondition?.filterById) {
                selectedIsNotInOptions.current = true;
            }
        }

        const setSelectedOption = (option) =>
            onSelectionChanged(isMulti ? option.map((opt) => opt[labelKey]) : option[labelKey]);

        return (
            <BaseSelection
                id={field.id}
                disabled={disabled || field.readOnly}
                options={options || []}
                selectedOption={formatSelectedOption}
                onSelectionChanged={setSelectedOption}
                isMulti={field.isMulti || false}
            />
        );
    },
);

export default observer(Selection);
