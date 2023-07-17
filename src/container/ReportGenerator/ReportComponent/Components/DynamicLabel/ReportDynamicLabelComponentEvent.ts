import React from 'react';

import { ReportComponentType } from '../../../../../interface/report-generator/component/rep-component';
import { RepLabelComponent } from '../../../../../interface/report-generator/component/rep-label-component';
import { Point } from '../../../../../interface/report-generator/rep-report';
import { generateUUID } from '../../../../../utils/general';

const ReportDynamicLabelComponentEvent = (): {
    onGenerate: (e: React.MouseEvent, pos: Point) => RepLabelComponent;
    onMouseUp: () => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseDown: () => void;
} => {
    const onGenerate = (e: React.MouseEvent, pos: Point) => {
        return {
            uuid: generateUUID(),
            x: pos.x,
            y: pos.y,
            componentType: ReportComponentType.DynamicLabel,
            valueType: 'string',
            value: 'PatientId',
            fontSize: 16,
            fontName: 'Arial',
            fontStyle: 'normal',
            fontColor: 'black',
            fontWeight: 400,
            suffix: '',
            prefix: '',
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
