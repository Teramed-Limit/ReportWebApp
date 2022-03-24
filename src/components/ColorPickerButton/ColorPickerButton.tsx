import React, { useState } from 'react';

import { ArrowDropDown, FormatColorFill } from '@mui/icons-material';
import { Button, Popover } from '@mui/material';
import { ColorResult, SketchPicker } from 'react-color';

import classes from './ColorPickerButton.module.scss';

interface Props {
    label?: string;
    value: string;
    onValueChange: (color: string) => void;
}

const ColorPickerButton = ({ label = '', value, onValueChange }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setColorPickerOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setColorPickerOpen(false);
        setAnchorEl(null);
    };

    const changeColor = (selectColor: ColorResult) => {
        onValueChange(selectColor.hex);
    };

    return (
        <>
            <Button onClick={handleClick} className={classes.button}>
                <span>{label}</span>
                <FormatColorFill style={{ color: value, fontSize: '24px' }} />
                <ArrowDropDown />
            </Button>
            <Popover
                open={colorPickerOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <SketchPicker color={value} onChangeComplete={changeColor} />
            </Popover>
        </>
    );
};

export default ColorPickerButton;
