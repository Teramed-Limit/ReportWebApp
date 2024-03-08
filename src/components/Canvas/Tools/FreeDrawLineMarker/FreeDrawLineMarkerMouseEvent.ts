import Konva from 'konva';

import { CanvasMarker, MarkerType } from '../../../../interface/canvas-maker-attribute';
import { generateUUID } from '../../../../utils/general';
import { getRelativePointerPosition, nullMouseEvent } from '../../canvas-utils';
import { MarkerEvent } from '../../MarkerEvent/MarkerEvent';

const markerType = MarkerType.FreeDraw;

/* eslint-disable @typescript-eslint/no-unused-vars */
const FreeDrawLineMarkerMouseEvent = (): MarkerEvent => {
    const onMouseDown = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        const point = getRelativePointerPosition(e.target.getStage());
        const uuid = generateUUID();
        const newMarker: CanvasMarker<Konva.LineConfig> = {
            id: uuid,
            name: `${markerType}`,
            type: markerType,
            attribute: {
                fill: subColor,
                stroke: mainColor,
                strokeWidth: 10,
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
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {};

    return {
        onClick: nullMouseEvent,
        onMouseDown,
        onMouseMove,
        onMouseUp,
    };
};

export default FreeDrawLineMarkerMouseEvent;
