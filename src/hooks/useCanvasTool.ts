import { MarkerEvent } from '../components/Canvas/MarkerEvent/MarkerEvent';
import ArrowMarkerMouseEvent from '../components/Canvas/Tools/ArrowMarker/ArrowMarkerMouseEvent';
import CircleMarkerMouseEvent from '../components/Canvas/Tools/CircleMarker/CircleMarkerMouseEvent';
import FreeDrawLineMarkerMouseEvent from '../components/Canvas/Tools/FreeDrawLineMarker/FreeDrawLineMarkerMouseEvent';
import NoneMouseEvent from '../components/Canvas/Tools/NoneMouseEvent';
import SquareMarkerMouseEvent from '../components/Canvas/Tools/SquareMarker/SquareMarkerMouseEvent';
import TextMarkerMouseEvent from '../components/Canvas/Tools/TextMarker/TextMarkerMouseEvent';
import { MarkerType } from '../interface/canvas-maker-attribute';

const ToolMouseEventMapper = {
    [MarkerType.None]: NoneMouseEvent,
    [MarkerType.Text]: TextMarkerMouseEvent,
    [MarkerType.Circle]: CircleMarkerMouseEvent,
    [MarkerType.Square]: SquareMarkerMouseEvent,
    [MarkerType.Arrow]: ArrowMarkerMouseEvent,
    [MarkerType.FreeDraw]: FreeDrawLineMarkerMouseEvent,
};

export function useCanvasTool(markerType: MarkerType = MarkerType.None) {
    const event = ToolMouseEventMapper[markerType]() as MarkerEvent;

    return {
        onClick: event.onClick,
        onMouseDown: event.onMouseDown,
        onMouseMove: event.onMouseMove,
        onMouseUp: event.onMouseUp,
    };
}
