import { useCallback } from 'react';

import Konva from 'konva';

export function useMarkerEvent<T extends Konva.Shape>(
    id,
    isSelected,
    shapeRef: T,
    onSelect,
    onUpdateAttr,
) {
    const onMouseDown = useCallback((e) => (e.cancelBubble = true), []);

    const onMouseEnter = useCallback(
        (e) => {
            const container = e.target.getStage().container();
            return isSelected
                ? (container.style.cursor = 'move')
                : (container.style.cursor = 'pointer');
        },
        [isSelected],
    );

    const onMouseLeave = useCallback((e) => {
        const container = e.target.getStage().container();
        container.style.cursor = 'default';
    }, []);

    const onClick = useCallback(
        (e) => {
            e.cancelBubble = true;
            onSelect(id);
        },
        [id, onSelect],
    );

    const onDragStart = useCallback((e) => {
        e.cancelBubble = true;
        e.evt.stopPropagation();
    }, []);

    const onDragEnd = useCallback(
        (e) => {
            if (shapeRef === null) {
                return;
            }

            e.cancelBubble = true;
            e.evt.stopPropagation();
            onUpdateAttr(id, shapeRef.attrs);
        },
        [id, onUpdateAttr, shapeRef],
    );

    return {
        onClick,
        onDragStart,
        onDragEnd,
        onMouseDown,
        onMouseEnter,
        onMouseLeave,
    };
}
