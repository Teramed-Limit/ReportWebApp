import React, { useContext, useEffect, useRef, useState } from 'react';

import Konva from 'konva';

import Canvas from '../../../components/Canvas/Canvas';
import CanvasOverlay from '../../../components/CanvasOvelay/CanvasOverlay';
import CanvasToolbar from '../../../components/CanvasToolbar/CanvasToolbar';
import MarkerAttribute from '../../../components/MarkerAttribute/MarkerAttribute';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { CanvasMarker, MarkerType } from '../../../interface/canvas-maker-attribute';
import { useReportDataStore } from '../../../models/useStore';
import classes from './ImageCanvasModal.module.scss';

interface Props {
    imageSrc: string;
}

const ImageCanvasModal = ({ imageSrc }: Props) => {
    const { valueChanged } = useReportDataStore();
    type CanvasHandle = React.ElementRef<typeof Canvas>;
    const canvasRef = React.useRef<CanvasHandle>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [markerSeq, setMarkerSeq] = useState(1);
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [markerType, setMarkerType] = React.useState<MarkerType>(MarkerType.None);
    const [selectMarkerId, setSelectMarkerId] = useState(-1);
    const [canvasMarkers, setCanvasMarkers] = React.useState<CanvasMarker<Konva.ShapeConfig>[]>([]);
    const [mainColor, setMainColor] = useState('red');
    const [subColor, setSubColor] = useState('rgba(0, 0, 0, 0.1)');

    const [selectMarkerAttrs, setSelectMarkerAttrs] = useState<Konva.ShapeConfig | undefined>(
        undefined,
    );

    const setModal = useContext(ModalContext);

    const onClose = () => setModal(null);

    const onConfirm = () => {
        setSelectMarkerId(-1);
        setTimeout(() => {
            valueChanged(
                'DiagramData',
                canvasRef.current?.onExport().replace('data:image/jpeg;base64,', ''),
            );
            setModal(null);
        });
    };

    useEffect(() => {
        if (containerRef === null || containerRef.current === null) {
            return;
        }
        setContainerWidth(containerRef.current.offsetWidth - 4);
        setContainerHeight(containerRef.current.offsetHeight - 4);
    }, []);

    useEffect(() => {
        setSelectMarkerAttrs(
            canvasMarkers.find((marker) => marker.id === selectMarkerId)?.attribute,
        );
    }, [canvasMarkers, selectMarkerId]);

    const handleCanvasTool = (event: React.MouseEvent<HTMLElement>, newFormat: string) => {
        if (!MarkerType[newFormat]) {
            console.error('tool not implemented!');
            return;
        }

        setMarkerType(MarkerType[newFormat]);
    };

    const onMarkerDelete = (markerId: number) => {
        setCanvasMarkers((value) => value.filter((marker) => marker.id !== markerId));
    };

    const onMarkerCopy = (markerId: number) => {
        const copyMarker = canvasMarkers.find((marker) => marker.id === markerId);
        if (!copyMarker) return;

        setCanvasMarkers((value) => {
            value.push({
                ...copyMarker,
                name: `${markerType}_${markerSeq}`,
                id: markerSeq,
            });
            return value.slice();
        });
        setMarkerSeq(markerSeq + 1);
    };

    const setAttribute = (attrName: string, attrValue: number | string | boolean) => {
        if (selectMarkerId === -1) return;
        setCanvasMarkers((markers) => {
            return markers.map((marker) => {
                if (marker.id === selectMarkerId) {
                    return {
                        ...marker,
                        attribute: {
                            ...marker.attribute,
                            [attrName]: attrValue,
                        },
                    };
                }
                return marker;
            });
        });
    };

    const body = (
        <div ref={containerRef} className={classes.canvasContainer}>
            <CanvasToolbar
                markerType={markerType}
                setCanvasTool={handleCanvasTool}
                mainColor={mainColor}
                setMainColor={setMainColor}
                subColor={subColor}
                setSubColor={setSubColor}
            />
            {selectMarkerAttrs ? (
                <MarkerAttribute
                    id={selectMarkerId}
                    attribute={selectMarkerAttrs}
                    setAttribute={setAttribute}
                />
            ) : null}
            <CanvasOverlay
                canvasMarkers={canvasMarkers}
                selectMarkerId={selectMarkerId}
                setCanvasMarkers={setCanvasMarkers}
                setSelectMarkerId={setSelectMarkerId}
                deleteMarker={onMarkerDelete}
                copyMarker={onMarkerCopy}
            />
            <Canvas
                ref={canvasRef}
                mainColor={mainColor}
                subColor={subColor}
                markerType={markerType}
                canvasMarkers={canvasMarkers}
                setCanvasMarkers={setCanvasMarkers}
                selectMarkerId={selectMarkerId}
                setSelectMarkerId={setSelectMarkerId}
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                imageSrc={imageSrc}
                markerSeq={markerSeq}
                setMarkerSeq={setMarkerSeq}
            />
        </div>
    );
    const footer = (
        <>
            <Button theme="primary" onClick={() => onConfirm()}>
                Confirm
            </Button>
            <Button theme="reversePrimary" onClick={() => onClose()}>
                Close
            </Button>
        </>
    );

    return (
        <Modal
            open
            width="90%"
            height="90%"
            onClose={() => onClose()}
            headerTitle="Edit Diagram"
            body={body}
            footer={footer}
            overflow="hidden"
        />
    );
};

export default ImageCanvasModal;
