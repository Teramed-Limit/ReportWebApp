import React from 'react';

import { Box, Chip } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';

interface Props extends ICellRendererParams {
    label: string;
    value: string[];
}

const ChipCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    return (
        <Box
            ref={ref}
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            }}
        >
            {props.value?.map((label) => {
                return (
                    <Box key={label} sx={{ mr: '2px', display: 'flex', alignItems: 'center ' }}>
                        <Chip size="small" label={label} />
                    </Box>
                );
            })}
        </Box>
    );
});

export default ChipCell;
