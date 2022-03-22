import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useState,
} from 'react';

import Konva from 'konva';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';

import { useCanvasTool } from '../../hooks/useCanvasTool';
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
        const stageRef = React.useRef<Konva.Stage>(null);
        const imageRef = React.useRef<Konva.Image>(null);
        const [image] = useImage(imageSrc, 'anonymous');
        const [isDrawing, setIsDrawing] = useState(false);
        const [scale, setScale] = useState(1);
        const [canvasWidth, setCanvasWidth] = useState(containerWidth);
        const [canvasHeight, setCanvasHeight] = useState(containerHeight);
        const [canvasPosition] = useState({ x: 0, y: 0 });
        const { onClick, onMouseMove, onMouseUp, onMouseDown } = useCanvasTool(markerType);

        useImperativeHandle(
            ref,
            () => ({
                onExport(): string {
                    if (!stageRef.current || !imageRef.current) return '';
                    let ratio = 1;

                    if (stageRef.current.height() < stageRef.current.width()) {
                        ratio = imageRef.current.height() / stageRef.current.height();
                    }

                    if (stageRef.current.height() > stageRef.current.width()) {
                        ratio = imageRef.current.width() / stageRef.current.width();
                    }

                    return stageRef.current.toDataURL({
                        pixelRatio: ratio,
                    });
                },
            }),
            [],
        );

        useEffect(() => {
            setSelectMarkerId(-1);
        }, [markerType, setSelectMarkerId]);

        useLayoutEffect(() => {
            if (!stageRef.current || !imageRef.current) {
                return;
            }

            const originalWidth = image?.naturalWidth || 0;
            const originalHeight = image?.naturalHeight || 0;

            if (originalWidth === 0 || originalHeight === 0) return;

            if (containerWidth < containerHeight) {
                const adjustedHeight = (originalHeight * containerWidth) / originalWidth;
                setCanvasWidth(containerWidth);
                setCanvasHeight(adjustedHeight);
                setScale(containerWidth / originalWidth);
            }

            if (containerWidth > containerHeight) {
                const adjustedWidth = (originalWidth * containerHeight) / originalHeight;
                setCanvasWidth(adjustedWidth);
                setCanvasHeight(containerHeight);
                setScale(containerHeight / originalHeight);
            }
        }, [containerHeight, containerWidth, image]);

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
