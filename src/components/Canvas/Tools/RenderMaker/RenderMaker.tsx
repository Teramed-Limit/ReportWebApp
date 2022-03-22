import React from 'react';

import Konva from 'konva';

import { useMarkerNode } from '../../../../hooks/useMarkerNode';
import { MarkerType } from '../../../../interface/canvas-maker-attribute';
import MarkerNode from '../../MarkerNode/MarkerNode';
import { MarkerMapper, NodeEnableMapper } from '../marker-mapper';

interface Props {
    id: number;
    markerType: MarkerType;
    attribute: Konva.ShapeConfig;
    isSelected: boolean;
    onMarkerSelect: (id: number) => void;
    onUpdateAttr: (id: number, attr: Konva.ShapeConfig) => void;
}

const RenderMaker = ({
    id,
    markerType,
    attribute,
    isSelected,
    onMarkerSelect,
    onUpdateAttr,
}: Props) => {
    const { shapeRef, nodeRef } = useMarkerNode<Konva.Shape>(isSelected);
    const RenderComponent = MarkerMapper[markerType];
    return (
        <>
            <RenderComponent
                ref={shapeRef}
                id={id}
                attribute={attribute}
                isSelected={isSelected}
                onSelect={onMarkerSelect}
                onUpdateAttr={onUpdateAttr}
            />
            {isSelected && NodeEnableMapper[markerType] ? (
                <MarkerNode ref={nodeRef} id={id} onUpdateAttr={onUpdateAttr} />
            ) : null}
        </>
    );
};

export default RenderMaker;
