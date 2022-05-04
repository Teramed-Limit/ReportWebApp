import React from 'react';

import { Box, Chip } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';

interface Props extends ICellRendererParams {
    value: string;
}

const StatusChipCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    return (
        <Box
            ref={ref}
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                paddingLeft: '18px',
                paddingRight: '18px',
            }}
        >
            <Chip
                size="small"
                color={props.colDef?.cellRendererParams[props.value]}
                label={props.value}
            />
        </Box>
    );
});

export default StatusChipCell;
