import React from 'react';

import { Point, RepLabelComponent } from '../../../../../interface/rep-report';
import { generateUUID } from '../../../../../utils/general';
import { ReportComponentType } from '../../report-component-mapper';

const ReportDynamicLabelComponentEvent = (): {
    onGenerate: (e: React.MouseEvent, pos: Point) => RepLabelComponent;
    onMouseUp: () => void;
    onMouseMove: () => void;
    onMouseDown: () => void;
} => {
    const onGenerate = (e: React.MouseEvent, pos: Point) => {
        return {
            uuid: generateUUID(),
            x: pos.x,
            y: pos.y,
            componentType: ReportComponentType.DynamicLabel,
            valueType: 'string',
            value: '{PatientId}',
            fontSize: 16,
            fontName: 'Noto Sans TC',
            fontStyle: 'normal',
            fontColor: 'black',
            fontWeight: 400,
        };
    };

    return {
        onGenerate,
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
    };
};

export default ReportDynamicLabelComponentEvent;
