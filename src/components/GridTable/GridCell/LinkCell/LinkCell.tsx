import React from 'react';

import { Link } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

interface Props extends ICellRendererParams {
    onClick: (...params) => void;
}

const LinkCell = (props: Props) => {
    return (
        <Link
            sx={{ color: '#256fc7', textDecorationColor: '#256fc7', textDecoration: 'underline' }}
            component="button"
            variant="body2"
            onClick={(event) => {
                event.stopPropagation();
                props?.onClick(props);
            }}
        >
            {props.value}
        </Link>
    );
};

export default LinkCell;
