import React from 'react';

import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

import classes from './BaseDatePicker.module.scss';

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
const BaseDatePicker = ({
    id,
    value = '',
    disabled = false,
    onValueChange,
    suffix,
    prefix,
    toFormat = 'YYYY-MM-DD',
    fromFormat = 'YYYYMMDD',
}: Props) => {
    const inputClasses = useStyles();

    const handleChange = (newValue: Dayjs | null) => {
        onValueChange(newValue?.format(toFormat) || '');
    };

    return (
        <div className={classes.container}>
            <span>{prefix}</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                    inputFormat={toFormat}
                    value={value}
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

export default BaseDatePicker;
