import React, { useImperativeHandle } from 'react';

import { Button } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';

interface Props extends ICellRendererParams {
    onClick: (...params) => void;
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant: 'text' | 'outlined' | 'contained';
    label: string;
}

const ButtonCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    useImperativeHandle(ref, () => ({
        getReactContainerStyle() {
            return {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            };
        },
    }));

    return (
        <Button
            sx={{ fontSize: '0.8125rem !important' }}
            variant={props.variant}
            color={props.color}
            onClick={() => props.onClick(props)}
        >
            {props.label}
        </Button>
    );
});

export default ButtonCell;
