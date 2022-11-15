import { useEffect, useState } from 'react';

import Konva from 'konva';

import ArrowMarkerMouseEvent from '../components/Canvas/Tools/ArrowMarker/ArrowMarkerMouseEvent';
import CircleMarkerMouseEvent from '../components/Canvas/Tools/CircleMarker/CircleMarkerMouseEvent';
import FreeDrawLineMarkerMouseEvent from '../components/Canvas/Tools/FreeDrawLineMarker/FreeDrawLineMarkerMouseEvent';
import NoneMouseEvent from '../components/Canvas/Tools/NoneMouseEvent';
import SquareMarkerMouseEvent from '../components/Canvas/Tools/SquareMarker/SquareMarkerMouseEvent';
import TextMarkerMouseEvent from '../components/Canvas/Tools/TextMarker/TextMarkerMouseEvent';
import { CanvasMarker, MarkerType } from '../interface/canvas-maker-attribute';

const ToolMouseEventMapper = {
    [MarkerType.None]: NoneMouseEvent,
    [MarkerType.Text]: TextMarkerMouseEvent,
    [MarkerType.Circle]: CircleMarkerMouseEvent,
    [MarkerType.Square]: SquareMarkerMouseEvent,
    [MarkerType.Arrow]: ArrowMarkerMouseEvent,
    [MarkerType.FreeDraw]: FreeDrawLineMarkerMouseEvent,
};

export function useCanvasTool(markerType: MarkerType = MarkerType.None): {
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
} {
    const [event, setEvent] = useState(ToolMouseEventMapper[markerType]);

    useEffect(() => {
        setEvent(ToolMouseEventMapper[markerType]);
    }, [markerType]);

    return {
        onClick: event.onClick,
        onMouseDown: event.onMouseDown,
        onMouseMove: event.onMouseMove,
        onMouseUp: event.onMouseUp,
    };
}
