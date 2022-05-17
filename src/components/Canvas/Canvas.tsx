import React, { forwardRef, useEffect, useState } from 'react';

import Konva from 'konva';
import { Image, Layer, Stage } from 'react-konva';

import { useCanvasTool } from '../../hooks/useCanvasTool';
import { useImageScaleToFit } from '../../hooks/useImageScaleToFit';
import { useKonva } from '../../hooks/useKonva';
import { CanvasMarker, MarkerType } from '../../interface/canvas-maker-attribute';
import classes from './Canvas.module.scss';
import RenderMaker from './Tools/RenderMaker/RenderMaker';

type CanvasHandle = {
    onExport(): string;
};

interface Props {
    mainColor: string;
    subColor: string;
    markerType: MarkerType;
    canvasMarkers: CanvasMarker<Konva.ShapeConfig>[];
    setCanvasMarkers: React.Dispatch<React.SetStateAction<CanvasMarker<Konva.ShapeConfig>[]>>;
    selectMarkerId: number;
    setSelectMarkerId: React.Dispatch<React.SetStateAction<number>>;
    imageSrc: string;
    containerWidth: number;
    containerHeight: number;
    markerSeq: number;
    setMarkerSeq: React.Dispatch<React.SetStateAction<number>>;
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
            markerSeq,
            setMarkerSeq,
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

        useEffect(() => {
            setSelectMarkerId(-1);
        }, [markerType, setSelectMarkerId]);

        const updateMarkerAttr = (id: number, attr: Konva.ShapeConfig) => {
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
                    if (selectMarkerId === -1) {
                        onClick(
                            e,
                            mainColor,
                            subColor,
                            markerSeq,
                            setMarkerSeq,
                            canvasMarkers,
                            setCanvasMarkers,
                        );
                        return;
                    }
                    setSelectMarkerId(-1);
                }}
                onDbClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    e.evt.stopPropagation();
                    setSelectMarkerId(-1);
                }}
                onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (selectMarkerId !== -1) return;
                    if (e.evt.which === 1) {
                        setIsDrawing(true);
                        onMouseDown(
                            e,
                            mainColor,
                            subColor,
                            markerSeq,
                            setMarkerSeq,
                            canvasMarkers,
                            setCanvasMarkers,
                        );
                    }
                }}
                onMouseMove={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (selectMarkerId !== -1) return;
                    if (e.evt.which === 1 && isDrawing) {
                        onMouseMove(
                            e,
                            mainColor,
                            subColor,
                            markerSeq,
                            setMarkerSeq,
                            canvasMarkers,
                            setCanvasMarkers,
                        );
                    }
                }}
                onMouseUp={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (selectMarkerId !== -1) return;
                    if (e.evt.which === 1 && isDrawing) {
                        setIsDrawing(false);
                        onMouseUp(
                            e,
                            mainColor,
                            subColor,
                            markerSeq,
                            setMarkerSeq,
                            canvasMarkers,
                            setCanvasMarkers,
                        );
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
