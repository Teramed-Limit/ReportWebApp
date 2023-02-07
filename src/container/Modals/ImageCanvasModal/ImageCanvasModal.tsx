import React, { useContext, useEffect, useRef, useState } from 'react';

import Konva from 'konva';
import * as R from 'ramda';

import AttributeList from '../../../components/AttributeList/AttributeList';
import Canvas from '../../../components/Canvas/Canvas';
import CanvasOverlay from '../../../components/CanvasOvelay/CanvasOverlay';
import CanvasToolbar from '../../../components/CanvasToolbar/CanvasToolbar';
import ColorPickerButton from '../../../components/ColorPickerButton/ColorPickerButton';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { CanvasMarker, MarkerType } from '../../../interface/canvas-maker-attribute';
import { generateUUID, isEmptyOrNil } from '../../../utils/general';
import classes from './ImageCanvasModal.module.scss';

interface Props {
    imageSrc: string;
    initMarkers: CanvasMarker<Konva.ShapeConfig>[];
    onExportCanvas?: (canvasMarkers: CanvasMarker<Konva.ShapeConfig>[], base64: string) => void;
}

const ImageCanvasModal = ({ imageSrc, initMarkers, onExportCanvas }: Props) => {
    type CanvasHandle = React.ElementRef<typeof Canvas>;
    const canvasRef = React.useRef<CanvasHandle>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [markerType, setMarkerType] = React.useState<MarkerType>(MarkerType.None);
    const [selectMarkerId, setSelectMarkerId] = useState<string>('');
    const [canvasMarkers, setCanvasMarkers] =
        React.useState<CanvasMarker<Konva.ShapeConfig>[]>(initMarkers);
    const [mainColor, setMainColor] = useState('red');
    const [subColor, setSubColor] = useState('rgba(0, 0, 0, 0.1)');

    const [selectMarkerAttrs, setSelectMarkerAttrs] = useState<Konva.ShapeConfig | undefined>(
        undefined,
    );

    const setModal = useContext(ModalContext);

    const onClose = () => setModal(null);

    const onConfirm = () => {
        setSelectMarkerId('');
        onExportCanvas?.(canvasMarkers, canvasRef.current?.onExport() || '');

        setModal(null);
    };

    useEffect(() => {
        if (containerRef === null || containerRef.current === null) {
            return;
        }
        setContainerWidth(containerRef.current.offsetWidth - 4);
        setContainerHeight(containerRef.current.offsetHeight - 4);
    }, []);

    const handleCanvasTool = (event: React.MouseEvent<HTMLElement>, newFormat: string) => {
        if (!MarkerType[newFormat]) {
            console.error('tool not implemented!');
            return;
        }

        setMarkerType(MarkerType[newFormat]);
    };

    const onMarkerDelete = (markerId: string) => {
        setCanvasMarkers((value) => value.filter((marker) => marker.id !== markerId));
    };

    const onMarkerCopy = (markerId: string) => {
        const copyMarker = canvasMarkers.find((marker) => marker.id === markerId);
        if (!copyMarker) return;

        setCanvasMarkers((value) => {
            const uuid = generateUUID();
            value.push({
                ...copyMarker,
                name: `${markerType}_${uuid}`,
                id: uuid,
            });
            return value.slice();
        });
    };

    const setAttribute = (attrPath: (number | string)[], attrValue: number | string | boolean) => {
        if (isEmptyOrNil(selectMarkerId)) return;
        setCanvasMarkers((markers) => {
            return markers.map((marker) => {
                if (marker.id === selectMarkerId) {
                    return R.assocPath(['attribute', attrPath], attrValue, marker);
                }
                return marker;
            });
        });
    };

    useEffect(() => {
        setSelectMarkerAttrs(
            canvasMarkers.find((marker) => marker.id === selectMarkerId)?.attribute,
        );
    }, [canvasMarkers, selectMarkerId]);

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
                <div className={classes.attributeContainer}>
                    <AttributeList
                        attribute={selectMarkerAttrs}
                        attributeComponentMapper={{
                            fill: [
                                {
                                    name: '',
                                    component: ColorPickerButton,
                                },
                            ],
                            stroke: [
                                {
                                    name: '',
                                    component: ColorPickerButton,
                                },
                            ],
                        }}
                        filterType="include"
                        includeAttribute={[
                            'width',
                            'height',
                            'text',
                            'fill',
                            'stroke',
                            'fontSize',
                            'radius',
                            'strokeWidth',
                            'pointerLength',
                            'pointerWidth',
                            'scaleX',
                            'scaleY',
                            'rotation',
                            'x',
                            'y',
                            'dashEnabled',
                        ]}
                        setAttribute={setAttribute}
                    />
                </div>
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
            headerTitle="Edit Diagram"
            body={body}
            footer={footer}
            overflow="hidden"
        />
    );
};

export default ImageCanvasModal;
