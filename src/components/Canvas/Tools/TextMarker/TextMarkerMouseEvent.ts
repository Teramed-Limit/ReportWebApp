import Konva from 'konva';

import { CanvasMarker, MarkerType } from '../../../../interface/canvas-maker-attribute';
import { generateUUID } from '../../../../utils/general';
import { getRelativePointerPosition, nullMouseEvent } from '../../canvas-utils';
import { MarkerEvent } from '../../MarkerEvent/MarkerEvent';

const markerType = MarkerType.Text;

/* eslint-disable @typescript-eslint/no-unused-vars */
const TextMarkerMouseEvent = (): MarkerEvent => {
    const onClick = (
        e: Konva.KonvaEventObject<MouseEvent>,
        mainColor: string,
        subColor: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
        setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
        setSelectMarkerId: (value: string) => void,
    ) => {
        e.cancelBubble = true;
        const point = getRelativePointerPosition(e.target.getStage());
        const uuid = generateUUID();
        const newMarker: CanvasMarker<Konva.TextConfig> = {
            id: uuid,
            name: `${markerType}`,
            type: markerType,
            attribute: {
                fill: subColor,
                stroke: mainColor,
                x: point.x,
                y: point.y,
                text: 'Label',
                fontSize: 48,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
            },
        };

        setCanvasMarkers(canvasMarkers.concat([newMarker]));
        setSelectMarkerId(uuid);
    };

    return {
        onClick,
        onMouseDown: nullMouseEvent,
        onMouseMove: nullMouseEvent,
        onMouseUp: nullMouseEvent,
    };
};

export default TextMarkerMouseEvent;
