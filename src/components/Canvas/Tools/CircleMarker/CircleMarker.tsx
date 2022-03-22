import React, { MutableRefObject } from 'react';

import Konva from 'konva';
import { Circle } from 'react-konva';

import { useMarkerEvent } from '../../../../hooks/useMarkerEvent';

interface Props {
    id: number;
    attribute: Konva.CircleConfig;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onUpdateAttr: (id: number, attr: Konva.ShapeConfig) => void;
}

const CircleMarker = React.forwardRef<Konva.Circle, Props>(
    ({ id, attribute, isSelected, onSelect, onUpdateAttr }, shapeRef) => {
        const {
            onClick,
            onDragStart,
            onDragEnd,
            onMouseDown,
            onMouseLeave,
            onMouseEnter,
        } = useMarkerEvent(
            id,
            isSelected,
            (shapeRef as MutableRefObject<Konva.Circle>).current,
            onSelect,
            onUpdateAttr,
        );

        return (
            <Circle
                ref={shapeRef}
                x={attribute.x}
                y={attribute.y}
                radius={attribute.radius}
                rotation={attribute.rotation}
                scaleX={attribute.scaleX}
                scaleY={attribute.scaleY}
                fill={attribute.fill}
                stroke={attribute.stroke}
                strokeWidth={attribute.strokeWidth}
                draggable={isSelected}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseEnter={onMouseEnter}
                onClick={onClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            />
        );
    },
);

export default CircleMarker;
