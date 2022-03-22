import React, { MutableRefObject } from 'react';

import Konva from 'konva';
import { Text } from 'react-konva';

import { useMarkerEvent } from '../../../../hooks/useMarkerEvent';

interface Props {
    id: number;
    attribute: Konva.TextConfig;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onUpdateAttr: (id: number, attr: Konva.ShapeConfig) => void;
}

const TextMarker = React.forwardRef<Konva.Text, Props>(
    ({ id, attribute, isSelected, onSelect, onUpdateAttr }: Props, shapeRef) => {
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
            (shapeRef as MutableRefObject<Konva.Text>).current,
            onSelect,
            onUpdateAttr,
        );

        return (
            <Text
                ref={shapeRef}
                text={attribute.text}
                x={attribute.x}
                y={attribute.y}
                rotation={attribute.rotation}
                scaleX={attribute.scaleX}
                scaleY={attribute.scaleY}
                fontSize={attribute.fontSize}
                draggable={isSelected}
                fill={attribute.fill}
                stroke={attribute.stroke}
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

export default TextMarker;
