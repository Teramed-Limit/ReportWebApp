import React from 'react';

import Konva from 'konva';
import { Transformer } from 'react-konva';

interface Props {
    id: number;
    onUpdateAttr: (id: number, attr: Konva.ShapeConfig) => void;
}

const MarkerNode = React.forwardRef<Konva.Transformer, Props>(({ id, onUpdateAttr }, trRef) => {
    return (
        <Transformer
            ref={trRef}
            onTransformEnd={(e) => {
                onUpdateAttr(id, e.target.attrs);
            }}
            boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                }
                return newBox;
            }}
        />
    );
});

export default MarkerNode;
