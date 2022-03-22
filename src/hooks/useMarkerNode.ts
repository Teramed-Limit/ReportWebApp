import React from 'react';

import Konva from 'konva';

export function useMarkerNode<T extends Konva.Shape>(isSelected = false) {
    const shapeRef = React.useRef<T>(null);
    const nodeRef = React.useRef<Konva.Transformer>(null);

    React.useEffect(() => {
        if (isSelected && nodeRef.current !== null && shapeRef.current !== null) {
            nodeRef.current.nodes([shapeRef.current]);
            nodeRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    return { shapeRef, nodeRef };
}
