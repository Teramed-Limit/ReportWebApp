import Konva from 'konva';

import { CanvasMarker, MarkerType } from '../../../../interface/canvas-maker-attribute';
import LocalStorageService from '../../../../service/local-storage-service';
import { generateUUID } from '../../../../utils/general';
import { getRelativePointerPosition, nullMouseEvent } from '../../canvas-utils';

const markerType = MarkerType.Text;

/* eslint-disable @typescript-eslint/no-unused-vars */
const TextMarkerMouseEvent = (): {
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
        fontSize: number;
    }>('konvaAttribute');

    const onClick = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
    ) => {
        e.cancelBubble = true;
        const point = getRelativePointerPosition(e.target.getStage());
        const uuid = generateUUID();
        const newMarker: CanvasMarker<Konva.TextConfig> = {
            id: uuid,
            name: `${markerType}_${uuid}`,
            type: markerType,
            attribute: {
                fill: konvaAttribute?.fill ? konvaAttribute.fill : subColor,
                stroke: konvaAttribute?.stroke ? konvaAttribute.stroke : mainColor,
                x: point.x,
                y: point.y,
                text: 'Label',
                fontSize: konvaAttribute?.fontSize ? konvaAttribute.fontSize : 48,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
            },
        };

        setCanvasMarkers(canvasMarkers.concat([newMarker]));
    };

    return {
        onClick,
        onMouseDown: nullMouseEvent,
        onMouseMove: nullMouseEvent,
        onMouseUp: nullMouseEvent,
    };
};

export default TextMarkerMouseEvent;
