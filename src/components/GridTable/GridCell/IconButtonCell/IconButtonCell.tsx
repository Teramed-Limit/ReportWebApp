import React, { useImperativeHandle } from 'react';

import { IconButton } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';

import { EditRowClick } from '../../../../hooks/useGridTable';

interface Props extends ICellRendererParams {
    onClick: EditRowClick;
}

const IconButtonCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
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
        <IconButton
            style={{ color: props.colDef?.cellRendererParams.color }}
            color="primary"
            component="span"
            onClick={() => props.onClick(props.data, 'update')}
            disabled={props.data.editable === undefined ? false : !props.data.editable}
        >
            {props.colDef?.cellRendererParams.icon}
        </IconButton>
    );
});

export default IconButtonCell;
