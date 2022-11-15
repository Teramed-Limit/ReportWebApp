import React, { MutableRefObject } from 'react';

import Konva from 'konva';
import { Rect } from 'react-konva';

import { useMarkerEvent } from '../../../../hooks/useMarkerEvent';

interface Props {
    id: number;
    attribute: Konva.RectConfig;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onUpdateAttr: (id: number, attr: Konva.ShapeConfig) => void;
}

const SquareMarker = React.forwardRef<Konva.Rect, Props>(
    ({ id, attribute, isSelected, onSelect, onUpdateAttr }, shapeRef) => {
        const { onClick, onDragStart, onDragEnd, onMouseDown, onMouseLeave, onMouseEnter } =
            useMarkerEvent(
                id,
                isSelected,
                (shapeRef as MutableRefObject<Konva.Rect>).current,
                onSelect,
                onUpdateAttr,
            );
        return (
            <Rect
                ref={shapeRef}
                x={attribute.x}
                y={attribute.y}
                rotation={attribute.rotation}
                scaleX={attribute.scaleX}
                scaleY={attribute.scaleY}
                width={attribute.width}
                height={attribute.height}
                strokeWidth={attribute.strokeWidth}
                fill={attribute.fill}
                stroke={attribute.stroke}
                draggable={isSelected}
                onMouseLeave={onMouseLeave}
                onMouseEnter={onMouseEnter}
                onMouseDown={onMouseDown}
                onClick={onClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            />
        );
    },
);

export default SquareMarker;
