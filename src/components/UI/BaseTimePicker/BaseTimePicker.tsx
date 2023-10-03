import React from 'react';

import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import classes from './BaseTimePicker.module.scss';

interface Props {
    id?: string;
    value: string;
    disabled?: boolean;
    onValueChange: (str: string) => void;
    onKeyPress?: (event) => void;
    suffix?: string;
    prefix?: string;
    customClass?: string;
    toFormat?: string;
    fromFormat?: string;
}

const useStyles = makeStyles({
    root: {
        '& .MuiInput-input': {
            padding: '0 !important',
        },
        '& .Mui-disabled': {
            '-webkit-text-fill-color': 'inherit',
        },
        '& .MuiInputBase-root': {
            padding: 0,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            color: 'inherit',
            fontWeight: 'inherit',
            border: 'none',
            outline: 0,
        },
        '& .MuiButtonBase-root': {
            minWidth: '14px',
            minHeight: '14px',
            padding: '0',
            margin: '0',
            '& .MuiSvgIcon-root': {
                fontSize: '14px',
            },
        },
    },
});
const BaseTimePicker = ({
    id,
    value = '',
    disabled = false,
    onValueChange,
    suffix,
    prefix,
}: Props) => {
    const inputClasses = useStyles();

    const handleChange = (newValue: Dayjs | null) => {
        const formattedDateTime = newValue?.format('HH:mm:ss A');
        onValueChange(formattedDateTime || '');
    };

    return (
        <div className={classes.container}>
            <span>{prefix}</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                    value={dayjs(value, 'HH:mm:ss A')}
                    disabled={disabled}
                    onChange={handleChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ width: '100%' }}
                            id={id}
                            type="text"
                            variant="standard"
                            className={inputClasses.root}
                            InputProps={{
                                ...params.InputProps,
                                disableUnderline: true,
                                placeholder: '',
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
            <span>{suffix}</span>
        </div>
    );
};

export default BaseTimePicker;
