import React from 'react';

import { PopoverProps } from '@mui/material/Popover';

export function usePopupState() {
    const [anchorEl, setAnchorEl] = React.useState<PopoverProps['anchorEl']>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
        setAnchorEl(null);
    };

    return { anchorEl, open, handleClick, handleClose };
}
