import Konva from 'konva';

import { CanvasMarker, MarkerType } from '../../../../interface/canvas-maker-attribute';
import { getRelativePointerPosition, nullMouseEvent } from '../../canvas-utils';

const markerType = MarkerType.Circle;

/* eslint-disable @typescript-eslint/no-unused-vars */
const CircleMarkerMouseEvent = (): {
    onClick: (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        markerSeq: number,
        setMarkerSeq: (value: number) => void,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => void;
    onMouseDown: (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        markerSeq: number,
        setMarkerSeq: (value: number) => void,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => void;
    onMouseMove: (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        markerSeq: number,
        setMarkerSeq: (value: number) => void,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => void;
    onMouseUp: (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        markerSeq: number,
        setMarkerSeq: (value: number) => void,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => void;
} => {
    const onClick = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        markerSeq: number,
        setMarkerSeq: (value: number) => void,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        e.cancelBubble = true;
        const point = getRelativePointerPosition(e.target.getStage());
        const newMarker: CanvasMarker<Konva.CircleConfig> = {
            id: markerSeq,
            name: `${markerType}_${markerSeq}`,
            type: markerType,
            attribute: {
                fill: subColor,
                stroke: mainColor,
                strokeWidth: 10,
                x: point.x,
                y: point.y,
                radius: 50,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
            },
        };

        setCanvasMarkers(canvasMarkers.concat([newMarker]));
        setMarkerSeq(markerSeq + 1);
    };

    return {
        onClick,
        onMouseDown: nullMouseEvent,
        onMouseMove: nullMouseEvent,
        onMouseUp: nullMouseEvent,
    };
};

export default CircleMarkerMouseEvent;
