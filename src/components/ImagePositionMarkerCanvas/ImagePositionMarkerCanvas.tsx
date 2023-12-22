import React, { forwardRef } from 'react';

import Konva from 'konva';
import { Group, Image, Layer, Rect, Stage, Text } from 'react-konva';

import { useImageScaleToFit } from '../../hooks/useImageScaleToFit';
import { useKonva } from '../../hooks/useKonva';
import { CanvasMarker } from '../../interface/canvas-maker-attribute';
import { ReportMark } from '../../interface/document-data';
import { CanvasHandle } from '../../interface/konva-stage-event';
import { MarkerPoint } from '../../interface/marker';
import classes from '../Canvas/Canvas.module.scss';
import RenderMaker from '../Canvas/Tools/RenderMaker/RenderMaker';

interface Props {
    src: string;
    imagePositionMarkers: ReportMark[];
    canvasMarkers: CanvasMarker<Konva.ShapeConfig>[];
    containerWidth: number;
    containerHeight: number;
    disabled: boolean;
    onMarkerPlace: (marker: MarkerPoint, sopInstanceUID: string) => void;
    onMarkerDelete: (marker: ReportMark) => void;
}

const markerScale = 25;
const fontSizeScale = 31.25;
const strokeWidthScale = 500;

const ImagePositionMarkerCanvas = forwardRef<CanvasHandle, Props>(
    (
        {
            src,
            imagePositionMarkers,
            containerWidth,
            containerHeight,
            canvasMarkers,
            onMarkerPlace,
        },
        ref,
    ) => {
        const { stageRef, imageRef } = useKonva(ref);
        const { image, scale, canvasWidth, canvasHeight, originalWidth, originalHeight } =
            useImageScaleToFit(src, containerWidth, containerHeight);

        let referenceSize = 0;
        if (originalWidth > originalHeight) referenceSize = originalWidth;
        else referenceSize = originalHeight;

        const onDropMarker = (e) => {
            e.preventDefault();
            if (!stageRef?.current) return;
            // register event position
            stageRef.current.setPointersPositions(e);
            const vector2d = stageRef.current.getPointerPosition();
            if (!vector2d) return;
            onMarkerPlace(
                {
                    PointX: vector2d.x / scale,
                    PointY: vector2d.y / scale,
                    PointInImageX: vector2d.x / scale,
                    PointInImageY: vector2d.y / scale,
                },
                e.dataTransfer.getData('sopInsUid'),
            );
        };

        return (
            <div onDragOver={(e) => e.preventDefault()} onDrop={onDropMarker}>
                <Stage
                    className={classes.canvas}
                    x={0}
                    y={0}
                    ref={stageRef}
                    width={canvasWidth || 0}
                    height={canvasHeight || 0}
                    scale={{ x: scale, y: scale }}
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
                                    isSelected={false}
                                    onMarkerSelect={() => {}}
                                    onUpdateAttr={() => {}}
                                />
                            );
                        })}
                        {imagePositionMarkers.map((marker) => {
                            return (
                                <Group
                                    key={marker.SOPInstanceUID}
                                    offsetX={referenceSize / markerScale / 2}
                                    offsetY={referenceSize / markerScale / 2}
                                >
                                    <Rect
                                        x={marker.PointInImageX}
                                        y={marker.PointInImageY}
                                        fill="red"
                                        width={referenceSize / markerScale}
                                        height={referenceSize / markerScale}
                                        stroke="black"
                                        strokeWidth={referenceSize / strokeWidthScale}
                                    />
                                    <Text
                                        x={marker.PointInImageX}
                                        y={marker.PointInImageY}
                                        text={marker.MappingNumber.toString()}
                                        fontSize={referenceSize / fontSizeScale}
                                        fill="white"
                                        offsetX={-(referenceSize / markerScale / 2 / 2)}
                                        offsetY={-(referenceSize / markerScale / 2 / 2) + 2}
                                    />
                                </Group>
                            );
                        })}
                    </Layer>
                </Stage>
            </div>
        );
    },
);

export default ImagePositionMarkerCanvas;
