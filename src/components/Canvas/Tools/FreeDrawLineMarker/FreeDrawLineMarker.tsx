import React from 'react';

import Konva from 'konva';
import { Line } from 'react-konva';

interface Props {
    id: number;
    attribute: Konva.LineConfig;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FreeDrawLineMarker = React.forwardRef<Konva.Line, Props>(({ id, attribute }, ref) => {
    return (
        <Line
            id={id.toString()}
            points={attribute.points}
            stroke={attribute.stroke}
            strokeWidth={attribute.strokeWidth}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation="source-over"
        />
    );
});

export default FreeDrawLineMarker;
