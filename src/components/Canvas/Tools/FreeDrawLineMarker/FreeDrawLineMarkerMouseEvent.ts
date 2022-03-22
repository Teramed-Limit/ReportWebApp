import Konva from 'konva';

import { CanvasMarker, MarkerType } from '../../../../interface/canvas-maker-attribute';
import { getRelativePointerPosition, nullMouseEvent } from '../../canvas-utils';

const markerType = MarkerType.FreeDraw;

/* eslint-disable @typescript-eslint/no-unused-vars */
const FreeDrawLineMarkerMouseEvent = (): {
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
    const onMouseDown = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        markerSeq: number,
        setMarkerSeq: (value: number) => void,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        const point = getRelativePointerPosition(e.target.getStage());
        const newMarker: CanvasMarker<Konva.LineConfig> = {
            id: markerSeq,
            name: `${markerType}_${markerSeq}`,
            type: markerType,
            attribute: {
                fill: subColor,
                stroke: mainColor,
                strokeWidth: 5,
                x: point.x,
                y: point.y,
                points: [point.x, point.y],
            },
        };

        setCanvasMarkers(canvasMarkers.concat([newMarker]));
    };

    const onMouseMove = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        markerSeq: number,
        setMarkerSeq: (value: number) => void,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        const point = getRelativePointerPosition(e.target.getStage());
        const lastMarker = { ...canvasMarkers[canvasMarkers.length - 1] };

        // add point
        lastMarker.attribute.points = lastMarker.attribute.points.concat([point.x, point.y]);

        // replace last
        canvasMarkers.splice(canvasMarkers.length - 1, 1, lastMarker);
        setCanvasMarkers(canvasMarkers.concat());
    };

    const onMouseUp = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        markerSeq: number,
        setMarkerSeq: (value: number) => void,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        setMarkerSeq(markerSeq + 1);
    };

    return { onClick: nullMouseEvent, onMouseDown, onMouseMove, onMouseUp };
};

export default FreeDrawLineMarkerMouseEvent;
