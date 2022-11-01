import React, { useContext, useEffect, useImperativeHandle, useState } from 'react';

import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';

import { ModalContext } from '../../../../context/modal-context';
import Modal from '../../../Modal/Modal';
import Button from '../../../UI/Button/Button';

interface Props extends ICellRendererParams {
    onClick: (...params) => void;
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant: 'text' | 'outlined' | 'contained';
    label: string;
}

const ImageCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    const setModal = useContext(ModalContext);
    const [imageSrc, setImageSrc] = useState<string>(`data:image/jpg;base64, ${props.value}`);

    useImperativeHandle(ref, () => ({
        getReactContainerStyle() {
            return {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            };
        },
    }));

    useEffect(() => {
        setImageSrc(`data:image/jpg;base64, ${props.value}`);
    }, [props.value]);

    return (
        <>
            <img
                draggable={false}
                src={imageSrc}
                alt=""
                onClick={() => {
                    setModal(
                        <Modal
                            open
                            width="50%"
                            height="fit-content"
                            onClose={() => setModal(null)}
                            headerTitle="Signature Preview"
                            body={
                                <img
                                    style={{ display: 'flex', margin: 'auto' }}
                                    draggable={false}
                                    src={imageSrc}
                                    alt=""
                                />
                            }
                            footer={
                                <Button theme="primary" onClick={() => setModal(null)}>
                                    Close
                                </Button>
                            }
                            overflow="hidden"
                        />,
                    );
                }}
            />
        </>
    );
});

export default ImageCell;
