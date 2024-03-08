import { nullMouseEvent } from '../canvas-utils';
import { MarkerEvent } from '../MarkerEvent/MarkerEvent';

const NoneMouseEvent = (): MarkerEvent => {
    return {
        onClick: nullMouseEvent,
        onMouseDown: nullMouseEvent,
        onMouseMove: nullMouseEvent,
        onMouseUp: nullMouseEvent,
    };
};

export default NoneMouseEvent;
