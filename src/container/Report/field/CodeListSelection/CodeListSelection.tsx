import React, { useEffect, useRef } from 'react';

import { observer } from 'mobx-react';

import BaseSelection from '../../../../components/UI/BaseSelection/BaseSelection';
import { CodeList } from '../../../../interface/code-list';
import { SelectionField } from '../../../../interface/selection-field';
import { useOptionStore } from '../../../../models/useStore';
import { coerceArray, isEmptyOrNil } from '../../../../utils/general';

interface SelectionProps {
    field: SelectionField<any>;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

const CodeListSelection = React.forwardRef(
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
        const { source } = optionSource;
        const selectedIsNotInOptions = useRef(false);

        const options = useOptionStore().getCodeList(source, filterCondition);

        useEffect(() => {
            if (selectedIsNotInOptions.current) {
                onSelectionChanged('');
                selectedIsNotInOptions.current = false;
            }
        }, [onSelectionChanged]);

        useEffect(() => {
            if (isEmptyOrNil(selectedOption) && options?.length === 1 && !isMulti) {
                onSelectionChanged(options[0].Value);
            }
        }, [isMulti, onSelectionChanged, options, selectedOption]);

        let formatValue = coerceArray(selectedOption);
        let formatSelectedOption;
        if (selectedOption && options) {
            formatValue = formatValue.map((str) => options.find((option) => option.Value === str));

            // selectedOption does not in options
            formatSelectedOption = isMulti ? formatValue : formatValue[0];
            if (!formatSelectedOption && filterCondition?.filterById) {
                selectedIsNotInOptions.current = true;
            }
        }

        const setSelectedOption = (option) => {
            if (isMulti) {
                onSelectionChanged(option?.map((opt: CodeList) => opt.Value) || []);
                return;
            }
            onSelectionChanged(option?.Value || '');
        };

        return (
            <BaseSelection
                id={field.id}
                disabled={disabled || field.readOnly}
                options={options || []}
                value={formatSelectedOption}
                onValueChange={setSelectedOption}
                isMulti={field.isMulti || false}
                getOptionValue={(option) => `${option.Value}`}
                getOptionLabel={(option) => `${option.Label}`}
            />
        );
    },
);

export default observer(CodeListSelection);
