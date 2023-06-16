import Konva from 'konva';

import { CanvasMarker, MarkerType } from '../../../../interface/canvas-maker-attribute';
import LocalStorageService from '../../../../service/local-storage-service';
import { generateUUID } from '../../../../utils/general';
import { getRelativePointerPosition, nullMouseEvent, reverse } from '../../canvas-utils';

const markerType = MarkerType.Square;

const SquareMarkerMouseEvent = () => {
    const onMouseDown = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        const konvaAttribute = LocalStorageService.getFromLocalStorage<{
            fill: string;
            stroke: string;
            radius: number;
            strokeWidth: number;
        }>('konvaAttribute');

        const point = getRelativePointerPosition(e.target.getStage());
        const uuid = generateUUID();
        const newMarker: CanvasMarker<Konva.RectConfig> = {
            id: uuid,
            name: `${markerType}_${uuid}`,
            type: markerType,
            attribute: {
                fill: konvaAttribute?.fill ? konvaAttribute.fill : subColor,
                stroke: konvaAttribute?.stroke ? konvaAttribute.stroke : mainColor,
                strokeWidth: konvaAttribute?.strokeWidth ? konvaAttribute.strokeWidth : 10,
                x: point.x,
                y: point.y,
                width: 0,
                height: 0,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
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
        const konvaAttribute = LocalStorageService.getFromLocalStorage<{
            fill: string;
            stroke: string;
            radius: number;
            strokeWidth: number;
        }>('konvaAttribute');

        const lastMarker = { ...canvasMarkers[canvasMarkers.length - 1] };
        const beginPoint = { x: lastMarker.attribute.x, y: lastMarker.attribute.y };
        const movePoint = getRelativePointerPosition(e.target.getStage());

        const posRect = reverse(beginPoint, movePoint);
        const uuid = generateUUID();
        const newMarker: CanvasMarker<Konva.RectConfig> = {
            id: uuid,
            name: `${markerType}_${uuid}`,
            type: markerType,
            attribute: {
                fill: konvaAttribute?.fill ? konvaAttribute.fill : subColor,
                stroke: konvaAttribute?.stroke ? konvaAttribute.stroke : mainColor,
                strokeWidth: konvaAttribute?.strokeWidth ? konvaAttribute.strokeWidth : 10,
                x: posRect.x1,
                y: posRect.y1,
                width: Math.floor(posRect.x2 - posRect.x1),
                height: Math.floor(posRect.y2 - posRect.y1),
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
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
        if (!lastMarker.attribute.width || lastMarker.attribute.width < 20) {
            canvasMarkers.splice(canvasMarkers.length - 1, 1);
            setCanvasMarkers(canvasMarkers.concat());
        }
    };

    return { onClick: nullMouseEvent, onMouseDown, onMouseMove, onMouseUp };
};

export default SquareMarkerMouseEvent;
