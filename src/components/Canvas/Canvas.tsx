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

import classes from './Canvas.module.scss';
import RenderMaker from './Tools/RenderMaker/RenderMaker';
import { useCanvasTool } from '../../hooks/useCanvasTool';
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
        const stageRef = React.useRef<Konva.Stage>(null);
        const imageRef = React.useRef<Konva.Image>(null);
        const [image] = useImage(imageSrc, 'anonymous');
        const [isDrawing, setIsDrawing] = useState(false);
        // const [scaleX, setScale] = useState(1);
        const [scaleX, setScaleX] = useState(1);
        const [scaleY, setScaleY] = useState(1);
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
            setSelectMarkerId('');
        }, [markerType, setSelectMarkerId]);

        useLayoutEffect(() => {
            if (!stageRef.current || !imageRef.current) {
                return;
            }

            const imageWidth = image?.naturalWidth || 0;
            const imageHeight = image?.naturalHeight || 0;

            if (imageWidth === 0 || imageHeight === 0) return;

            const imageRatio = imageWidth / imageHeight;
            const canvasRatio = containerWidth / containerHeight;

            let newWidth: number;
            let newHeight: number;

            // 根據畫布比率調整圖像尺寸
            if (imageRatio < canvasRatio) {
                newHeight = containerHeight;
                newWidth = imageWidth * (containerHeight / imageHeight);
            } else {
                newWidth = containerWidth;
                newHeight = imageHeight * (containerWidth / imageWidth);
            }

            setCanvasWidth(newWidth);
            setCanvasHeight(newHeight);

            // 計算縮放比例
            setScaleX(newWidth / imageWidth);
            setScaleY(newHeight / imageHeight);
        }, [canvasHeight, canvasWidth, containerHeight, containerWidth, image]);

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
                scaleX={scaleX || 1}
                scaleY={scaleY || 1}
                width={canvasWidth || 0}
                height={canvasHeight || 0}
                onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    e.evt.stopPropagation();
                    setSelectMarkerId('');
                    if (!isEmptyOrNil(selectMarkerId)) return;
                    onClick(
                        e,
                        mainColor,
                        subColor,
                        canvasMarkers,
                        setCanvasMarkers,
                        setSelectMarkerId,
                    );
                }}
                onDbClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    e.evt.stopPropagation();
                    setSelectMarkerId('');
                }}
                onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (!isEmptyOrNil(selectMarkerId)) return;
                    if (e.evt.which === 1) {
                        setIsDrawing(true);
                        onMouseDown(
                            e,
                            mainColor,
                            subColor,
                            canvasMarkers,
                            setCanvasMarkers,
                            setSelectMarkerId,
                        );
                    }
                }}
                onMouseMove={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (!isEmptyOrNil(selectMarkerId)) return;
                    if (e.evt.which === 1 && isDrawing) {
                        onMouseMove(
                            e,
                            mainColor,
                            subColor,
                            canvasMarkers,
                            setCanvasMarkers,
                            setSelectMarkerId,
                        );
                    }
                }}
                onMouseUp={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    if (!isEmptyOrNil(selectMarkerId)) return;
                    if (e.evt.which === 1 && isDrawing) {
                        setIsDrawing(false);
                        onMouseUp(
                            e,
                            mainColor,
                            subColor,
                            canvasMarkers,
                            setCanvasMarkers,
                            setSelectMarkerId,
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
