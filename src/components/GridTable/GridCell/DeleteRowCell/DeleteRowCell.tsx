import React, { useContext, useImperativeHandle } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';

import MessageModal from '../../../../container/Modals/MessageModal/MessageModal';
import { ModalContext } from '../../../../context/modal-context';
import { DeleteRowClick } from '../../../../hooks/useGridTable';

interface Props extends ICellRendererParams {
    onClick: DeleteRowClick;
}

const DeleteRowCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    const setModal = useContext(ModalContext);

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
            color="error"
            component="span"
            onClick={() =>
                setModal(
                    <MessageModal
                        headerTitle="Message"
                        bodyContent="Are you sure to delete the row?"
                        onConfirmCallback={() => props.onClick(props)}
                    />,
                )
            }
        >
            <ClearIcon />
        </IconButton>
    );
});

export default DeleteRowCell;
