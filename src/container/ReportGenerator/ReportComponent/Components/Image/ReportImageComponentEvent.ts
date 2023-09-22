import React from 'react';

import { ReportComponentType } from '../../../../../interface/report-generator/component/rep-component';
import { RepImageComponent } from '../../../../../interface/report-generator/component/rep-image-component';
import { Point } from '../../../../../interface/report-generator/rep-report';
import { generateUUID } from '../../../../../utils/general';

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
            width: 50,
            height: 50,
            src: 'https://picsum.photos/200',
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
