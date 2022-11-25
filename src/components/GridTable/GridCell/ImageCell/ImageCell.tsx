import React, { useContext, useEffect, useImperativeHandle, useState } from 'react';

import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';

import { ModalContext } from '../../../../context/modal-context';
import Modal from '../../../Modal/Modal';
import Button from '../../../UI/Button/Button';

type Props = ICellRendererParams;

const ImageCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    const setModal = useContext(ModalContext);
    const [imageSrc, setImageSrc] = useState<string>(props.value);

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
        if (/^(f|ht)tps?:\/\//i.test(props.value)) {
            setImageSrc(props.value);
            return;
        }
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