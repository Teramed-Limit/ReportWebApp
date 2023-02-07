import React, { useEffect, useState } from 'react';

import ReportDynamicLabelComponentEvent from '../container/ReportGenerator/ReportComponent/Components/DynamicLabel/ReportDynamicLabelComponentEvent';
import ReportGeneralEvent from '../container/ReportGenerator/ReportComponent/Components/General/ReportGeneralEvent';
import ReportImageComponentEvent from '../container/ReportGenerator/ReportComponent/Components/Image/ReportImageComponentEvent';
import ReportLabelComponentEvent from '../container/ReportGenerator/ReportComponent/Components/Label/ReportLabelComponentEvent';
import { ReportComponentType } from '../container/ReportGenerator/ReportComponent/report-component-mapper';
import { Point, RepComponent } from '../interface/rep-report';

const ToolMouseEventMapper = {
    [ReportComponentType.General]: ReportGeneralEvent,
    [ReportComponentType.Label]: ReportLabelComponentEvent,
    [ReportComponentType.Image]: ReportImageComponentEvent,
    [ReportComponentType.DynamicLabel]: ReportDynamicLabelComponentEvent,
};

export function useRepComponentTool(compType: ReportComponentType = ReportComponentType.General): {
    onGenerate: (e: React.MouseEvent, pos: Point) => RepComponent | null;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
} {
    const [event, setEvent] = useState(ToolMouseEventMapper[compType]);

    useEffect(() => {
        setEvent(ToolMouseEventMapper[compType]);
    }, [compType]);

    return {
        onGenerate: event.onGenerate,
        onMouseDown: event.onMouseDown,
        onMouseMove: event.onMouseMove,
        onMouseUp: event.onMouseUp,
    };
}
