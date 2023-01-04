import Konva from 'konva';

import { CanvasMarker } from '../../interface/canvas-maker-attribute';

export function getRelativePointerPosition(node): Konva.Vector2d {
    if (node === undefined) {
        return { x: 0, y: 0 };
    }
    // the function will return pointer position relative to the passed node
    const transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    const pos = node.getStage().getPointerPosition();

    // now we find relative point
    return transform.point(pos);
}

export function reverse(r1, r2) {
    let r1x = r1.x;
    let r1y = r1.y;
    let r2x = r2.x;
    let r2y = r2.y;
    let d;
    if (r1x > r2x) {
        d = Math.abs(r1x - r2x);
        r1x = r2x;
        r2x = r1x + d;
    }
    if (r1y > r2y) {
        d = Math.abs(r1y - r2y);
        r1y = r2y;
        r2y = r1y + d;
    }
    return { x1: r1x, y1: r1y, x2: r2x, y2: r2y }; // return the corrected rect.
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function nullMouseEvent(
    e: Konva.KonvaEventObject<MouseEvent>,
    mainColor: string,
    subColor: string,
    canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
    setCanvasMarkers: (value: CanvasMarker<Konva.ShapeConfig>[]) => void,
) {}
