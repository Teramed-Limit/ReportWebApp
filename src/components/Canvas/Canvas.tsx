import React, { forwardRef, useState } from 'react';

import Konva from 'konva';
import { Image, Layer, Stage } from 'react-konva';

import classes from './Canvas.module.scss';
import RenderMaker from './Tools/RenderMaker/RenderMaker';
import { useCanvasTool } from '../../hooks/useCanvasTool';
import { useImageScaleToFit } from '../../hooks/useImageScaleToFit';
import { useKonva } from '../../hooks/useKonva';
import { CanvasMarker, MarkerType } from '../../interface/canvas-maker-attribute';
import { isEmptyOrNil } from '../../utils/general';

type CanvasHandle = {
    onExport(): string;
};

interface Props {
    mainColor: string;
    subColor: string;
    markerType: MarkerType;
    canvasMarkers: CanvasMarker<Konva.ShapeConfig>[];
    setCanvasMarkers: React.Dispatch<React.SetStateAction<CanvasMarker<Konva.ShapeConfig>[]>>;
    selectMarkerId: string;
    setSelectMarkerId: React.Dispatch<React.SetStateAction<string>>;
    imageSrc: string;
    containerWidth: number;
    containerHeight: number;
}

const Canvas = forwardRef<CanvasHandle, Props>(
    (
        {
            mainColor,
            subColor,
            canvasMarkers = [],
            markerType,
            setCanvasMarkers,
            selectMarkerId,
            setSelectMarkerId,
            imageSrc,
            containerWidth,
            containerHeight,
        },
        ref,
    ) => {
        const { stageRef, imageRef } = useKonva(ref);
        const [isDrawing, setIsDrawing] = useState(false);
        const [canvasPosition] = useState({ x: 0, y: 0 });
        const { onClick, onMouseMove, onMouseUp, onMouseDown } = useCanvasTool(markerType);
        const { image, scale, canvasWidth, canvasHeight } = useImageScaleToFit(
            imageSrc,
            containerWidth,
            containerHeight,
        );

        const updateMarkerAttr = (id: string, attr: Konva.ShapeConfig) => {
            setCanvasMarkers((markers) => {
                return markers.map((marker) => {
                    if (marker.id === id) {
                        return {
                            ...marker,
                            attribute: { ...attr },
                        };
                    }
                    return marker;
                });
            });
        };

        return (
            <Stage
                className={classes.canvas}
                x={canvasPosition.x || 0}
                y={canvasPosition.y || 0}
                ref={stageRef}
                scaleX={scale || 1}
                scaleY={scale || 1}
                width={canvasWidth || 0}
                height={canvasHeight || 0}
                onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    e.evt.stopPropagation();
                    setSelectMarkerId('');
                    if (!isEmptyOrNil(selectMarkerId)) return;
                    onClick(e, mainColor, subColor, canvasMarkers, setCanvasMarkers);
                }}
                onDbClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    e.evt.stopPropagation();
                    setSelectMarkerId('');
                }}
                onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (!isEmptyOrNil(selectMarkerId)) return;
                    if (e.evt.which === 1) {
                        setIsDrawing(true);
                        onMouseDown(e, mainColor, subColor, canvasMarkers, setCanvasMarkers);
                    }
                }}
                onMouseMove={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (!isEmptyOrNil(selectMarkerId)) return;
                    if (e.evt.which === 1 && isDrawing) {
                        onMouseMove(e, mainColor, subColor, canvasMarkers, setCanvasMarkers);
                    }
                }}
                onMouseUp={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (!isEmptyOrNil(selectMarkerId)) return;
                    if (e.evt.which === 1 && isDrawing) {
                        setIsDrawing(false);
                        onMouseUp(e, mainColor, subColor, canvasMarkers, setCanvasMarkers);
                    }
                }}
            >
                <Layer>
                    <Image ref={imageRef} image={image} />
                    {canvasMarkers.map((marker) => {
                        return (
                            <RenderMaker
                                id={marker.id}
                                key={marker.id}
                                markerType={marker.type}
                                attribute={marker.attribute}
                                isSelected={selectMarkerId === marker.id}
                                onMarkerSelect={setSelectMarkerId}
                                onUpdateAttr={updateMarkerAttr}
                            />
                        );
                    })}
                </Layer>
            </Stage>
        );
    },
);

export default Canvas;
