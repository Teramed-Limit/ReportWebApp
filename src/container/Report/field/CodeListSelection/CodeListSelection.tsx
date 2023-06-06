import React, { useEffect, useRef } from 'react';

import SyncIcon from '@mui/icons-material/Sync';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react';

import BaseSelection from '../../../../components/UI/BaseSelection/BaseSelection';
import { CodeList } from '../../../../interface/code-list';
import { SelectionField } from '../../../../interface/selection-field';
import { useOptionStore } from '../../../../models/useStore';
import { coerceArray, isEmptyOrNil } from '../../../../utils/general';

interface SelectionProps {
    field: SelectionField;
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

        const optionStore = useOptionStore();
        const options = optionStore.getCodeList(source, filterCondition);

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

        // 如果值沒有在選項內，直接設位空值
        useEffect(() => {
            if (selectedIsNotInOptions.current) {
                onSelectionChanged('');
                selectedIsNotInOptions.current = false;
            }
        }, [onSelectionChanged, optionStore, source]);

        // 如果選項只有一個，直接預設選擇第一個
        useEffect(() => {
            if (isEmptyOrNil(selectedOption) && options?.length === 1 && !isMulti) {
                onSelectionChanged(options[0].Value);
            }
        }, [isMulti, onSelectionChanged, options, selectedOption]);

        return (
            <>
                <BaseSelection
                    id={field.id}
                    disabled={disabled || field.readOnly}
                    options={options || []}
                    selectedOption={formatSelectedOption}
                    onSelectionChanged={setSelectedOption}
                    isMulti={field.isMulti || false}
                    getOptionValue={(option) => `${option.Value}`}
                    getOptionLabel={(option) => `${option.Label}`}
                />
                {field?.fetchLatest && (
                    <IconButton
                        sx={{ minHeight: '20px', minWidth: '20px', padding: 0 }}
                        onClick={() => optionStore.getLatestCodeList(source)}
                    >
                        <SyncIcon color="warning" sx={{ fontSize: '20px' }} />
                    </IconButton>
                )}
            </>
        );
    },
);

export default observer(CodeListSelection);
