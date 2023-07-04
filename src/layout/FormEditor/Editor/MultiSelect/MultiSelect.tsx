import React, { useRef } from 'react';

import {
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';

import classes from './MultiSelect.module.scss';
import { useSelectOptions } from '../../../../hooks/useSelectOptions';
import { FormSelectionField } from '../../../../interface/form-editor-define';

interface Props {
    field: FormSelectionField;
    value: string[];
    readOnly?: boolean;
    autoFocus: boolean;
    onValueChanged: (value: string[], fieldId: string) => void;
}

const MultiSelect = ({ field, value, autoFocus, onValueChanged, readOnly = false }: Props) => {
    const [selectOptions, setSelectOptions] = React.useState<string[]>(value || []);
    const { options } = useSelectOptions(field.optionSource.type, field.optionSource.source);
    const selectRef = useRef<HTMLSelectElement>(null); // Ref for the Select component

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        setSelectOptions(event.target.value as string[]);
        onValueChanged(event.target.value as string[], field.id);
    };
    const handleDelete = (item: string) => {
        setSelectOptions((pre) => {
            const newVal = pre.filter((option) => option !== item);
            onValueChanged(newVal as string[], field.id);
            return newVal;
        });
    };

    return (
        <FormControl fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel className={classes.label}>{field.label}</InputLabel>
            <Select
                ref={selectRef}
                id={field.id}
                label={field.label}
                multiple
                autoFocus={autoFocus}
                disabled={readOnly}
                value={selectOptions}
                onChange={handleChange}
                inputProps={{
                    className: classes.input,
                }}
                renderValue={(selected: string[]) => (
                    <div className={classes.chips}>
                        {selected.map((item) => (
                            <Chip
                                size="small"
                                key={item}
                                label={item}
                                className={classes.chip}
                                onDelete={() => handleDelete(item)}
                                onMouseDown={(event) => {
                                    // 防止選擇器打開
                                    event.stopPropagation();
                                }}
                            />
                        ))}
                    </div>
                )}
            >
                {options.map((item) => {
                    const optionLabel = field.optionSource.labelKey
                        ? item[field.optionSource.labelKey]
                        : item;
                    const optionKey = field.optionSource.key ? item[field.optionSource.key] : item;

                    return (
                        <MenuItem key={optionLabel} value={optionKey}>
                            <Checkbox checked={selectOptions.indexOf(optionKey) > -1} />
                            <ListItemText primary={optionKey} />
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default MultiSelect;
