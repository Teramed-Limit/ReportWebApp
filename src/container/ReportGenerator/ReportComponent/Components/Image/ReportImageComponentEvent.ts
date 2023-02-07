import React from 'react';

import { Point, RepImageComponent } from '../../../../../interface/rep-report';
import { generateUUID } from '../../../../../utils/general';
import { ReportComponentType } from '../../report-component-mapper';

const ReportImageComponentEvent = (): {
    onGenerate: (e: React.MouseEvent, pos: Point) => RepImageComponent;
    onMouseUp: () => void;
    onMouseMove: () => void;
    onMouseDown: () => void;
} => {
    const onGenerate = (e: React.MouseEvent, pos: Point) => {
        return {
            uuid: generateUUID(),
            x: pos.x,
            y: pos.y,
            componentType: ReportComponentType.Image,
            width: 100,
            height: 100,
            valueType: 'base64',
            value: 'https://picsum.photos/200',
        };
    };

    return {
        onGenerate,
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
    };
};

export default ReportImageComponentEvent;
