import React from 'react';

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

import { useSelectOptions } from '../../../../hooks/useSelectOptions';
import { FormSelectionField } from '../../../../interface/form-editor-define';
import classes from './MultiSelect.module.scss';

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

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        setSelectOptions(event.target.value as string[]);
        onValueChanged(event.target.value as string[], field.id);
    };

    return (
        <FormControl fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel className={classes.label}>{field.label}</InputLabel>
            <Select
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
                            <Chip size="small" key={item} label={item} className={classes.chip} />
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
