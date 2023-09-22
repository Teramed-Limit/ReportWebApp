import React from 'react';

import { ReportComponentType } from '../../../../../interface/report-generator/component/rep-component';
import { RepPageNumberComponent } from '../../../../../interface/report-generator/component/rep-page-num-component';
import { Point } from '../../../../../interface/report-generator/rep-report';
import { generateUUID } from '../../../../../utils/general';

const ReportPageNumberComponentEvent = (): {
    onGenerate: (e: React.MouseEvent, pos: Point) => RepPageNumberComponent;
    onMouseUp: () => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseDown: () => void;
} => {
    const onGenerate = (e: React.MouseEvent, pos: Point) => {
        return {
            uuid: generateUUID(),
            x: pos.x,
            y: pos.y,
            componentType: ReportComponentType.PageNumber,
            fontSize: 16,
            fontName: 'Arial',
            fontStyle: 'normal',
            fontColor: 'gray',
            fontWeight: 400,
            showTotalPages: true,
        };
    };

    return {
        onGenerate,
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
    };
};

export default ReportPageNumberComponentEvent;
