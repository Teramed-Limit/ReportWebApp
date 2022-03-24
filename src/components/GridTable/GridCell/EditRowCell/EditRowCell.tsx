import React, { useImperativeHandle } from 'react';

import { IconButton } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';
import { FaEdit } from 'react-icons/all';

import { EditRowClick } from '../../../../hooks/useGridTable';

interface Props extends ICellRendererParams {
    onClick: EditRowClick;
}

const EditRowCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
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
            color="primary"
            component="span"
            onClick={() => props.onClick(props, 'update')}
            disabled={props.data.editable === undefined ? false : !props.data.editable}
        >
            <FaEdit />
        </IconButton>
    );
});

export default EditRowCell;
