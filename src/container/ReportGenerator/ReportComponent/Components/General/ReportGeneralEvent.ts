import React from 'react';

import { Point, RepComponent } from '../../../../../interface/rep-report';

const ReportGeneralEvent = (): {
    onGenerate: (e: React.MouseEvent, pos: Point) => RepComponent | null;
    onMouseUp: () => void;
    onMouseMove: () => void;
    onMouseDown: () => void;
} => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onGenerate = (e: React.MouseEvent, pos: Point) => {
        return null;
    };

    return {
        onGenerate,
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {},
    };
};

export default ReportGeneralEvent;
