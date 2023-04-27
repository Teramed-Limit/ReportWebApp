import Konva from 'konva';

import { CanvasMarker, MarkerType } from '../../../../interface/canvas-maker-attribute';
import LocalStorageService from '../../../../service/local-storage-service';
import { generateUUID } from '../../../../utils/general';
import { getRelativePointerPosition, nullMouseEvent } from '../../canvas-utils';

const markerType = MarkerType.Arrow;

const ArrowMarkerMouseEvent = (): {
    onClick: (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => void;
    onMouseDown: (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => void;
    onMouseMove: (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => void;
    onMouseUp: (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => void;
} => {
    const konvaAttribute = LocalStorageService.getFromLocalStorage<{
        fill: string;
        stroke: string;
        radius: number;
        strokeWidth: number;
    }>('konvaAttribute');

    const onMouseDown = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        const point = getRelativePointerPosition(e.target.getStage());
        const uuid = generateUUID();
        const newMarker: CanvasMarker<Konva.ShapeConfig> = {
            id: uuid,
            name: `${markerType}_${uuid}`,
            type: markerType,
            attribute: {
                fill: konvaAttribute?.fill ? konvaAttribute.fill : subColor,
                stroke: konvaAttribute?.stroke ? konvaAttribute.stroke : mainColor,
                strokeWidth: konvaAttribute?.strokeWidth ? konvaAttribute.strokeWidth : 10,
                x: point.x,
                y: point.y,
                points: [0, 0, 0, 0],
                pointerLength: 20,
                pointerWidth: 20,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                dashEnabled: false,
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
        const lastMarker = { ...canvasMarkers[canvasMarkers.length - 1] };
        const beginPoint = { x: lastMarker.attribute.x, y: lastMarker.attribute.y };
        const movePoint = getRelativePointerPosition(e.target.getStage());

        if (beginPoint.x === undefined || beginPoint.y === undefined) {
            return;
        }

        const uuid = generateUUID();
        const newMarker: CanvasMarker<Konva.ShapeConfig> = {
            id: uuid,
            name: `${markerType}_${uuid}`,
            type: markerType,
            attribute: {
                fill: konvaAttribute?.fill ? konvaAttribute.fill : subColor,
                stroke: konvaAttribute?.stroke ? konvaAttribute.stroke : mainColor,
                strokeWidth: konvaAttribute?.strokeWidth ? konvaAttribute.strokeWidth : 10,
                x: beginPoint.x,
                y: beginPoint.y,
                points: [0, 0, movePoint.x - beginPoint.x, movePoint.y - beginPoint.y],
                pointerLength: 20,
                pointerWidth: 20,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                dashEnabled: false,
            },
        };

        canvasMarkers.splice(canvasMarkers.length - 1, 1);
        setCanvasMarkers(canvasMarkers.concat([newMarker]));
    };
    const onMouseUp = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        const lastMarker = canvasMarkers[canvasMarkers.length - 1];
        const beginPoint = { x: lastMarker.attribute.x, y: lastMarker.attribute.y };
        const lastPoint = getRelativePointerPosition(e.target.getStage());

        if (beginPoint.x === undefined || beginPoint.y === undefined) {
            return;
        }

        if (Math.abs(beginPoint.x - lastPoint.x) < 5 || Math.abs(beginPoint.y - lastPoint.y) < 5) {
            canvasMarkers.splice(canvasMarkers.length - 1, 1);
            setCanvasMarkers(canvasMarkers.concat());
        }
    };

    return { onClick: nullMouseEvent, onMouseDown, onMouseMove, onMouseUp };
};

export default ArrowMarkerMouseEvent;
