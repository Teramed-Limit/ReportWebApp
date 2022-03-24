import React, { useEffect } from 'react';

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
import { map } from 'rxjs/operators';

import { axiosIns } from '../../../../axios/axios';
import { SelectionField } from '../../../../interface/selection-field';
import classes from './MultiSelect.module.scss';

interface Props {
    field: SelectionField<any>;
    value: string[];
    readOnly?: boolean;
    autoFocus: boolean;
    onValueChanged: (value: string[], fieldId: string) => void;
}

const MultiSelect = ({ field, value, autoFocus, onValueChanged, readOnly = false }: Props) => {
    const [selectOptions, setSelectOptions] = React.useState<string[]>(value);
    const [options, setOptions] = React.useState<string[]>([]);

    useEffect(() => {
        const subscription = axiosIns
            .get(field.optionSource.source)
            .pipe(
                map((res) =>
                    res.data.map((item) =>
                        field?.optionSource?.format ? item[field.optionSource.format] : item,
                    ),
                ),
            )
            .subscribe({
                next: setOptions,
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [field.optionSource]);

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
                value={value}
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
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        <Checkbox checked={selectOptions.indexOf(option) > -1} />
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MultiSelect;
