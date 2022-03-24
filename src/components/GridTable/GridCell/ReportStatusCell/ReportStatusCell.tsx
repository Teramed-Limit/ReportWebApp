import React, { useImperativeHandle } from 'react';

import { Chip } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';

interface Props extends ICellRendererParams {
    value: number;
}

const ReportStatusCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
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
        <>
            {props?.value === 1 ? (
                <Chip size="small" color="success" label="Completed" />
            ) : (
                <Chip size="small" color="warning" label="Incomplete" />
            )}
        </>
    );
});

export default ReportStatusCell;
