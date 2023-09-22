import React, { useEffect, useState } from 'react';

import ReportDynamicLabelComponentEvent from '../container/ReportGenerator/ReportComponent/Components/DynamicLabel/ReportDynamicLabelComponentEvent';
import ReportGeneralEvent from '../container/ReportGenerator/ReportComponent/Components/General/ReportGeneralEvent';
import ReportImageComponentEvent from '../container/ReportGenerator/ReportComponent/Components/Image/ReportImageComponentEvent';
import ReportLabelComponentEvent from '../container/ReportGenerator/ReportComponent/Components/Label/ReportLabelComponentEvent';
import ReportLineComponentEvent from '../container/ReportGenerator/ReportComponent/Components/Line/ReportLineComponentEvent';
import ReportPageNumberComponentEvent from '../container/ReportGenerator/ReportComponent/Components/PageNumber/ReportPageNumberComponentEvent';
import ReportSignatureComponentEvent from '../container/ReportGenerator/ReportComponent/Components/Signature/ReportSignatureComponentEvent';
import {
    RepComponent,
    ReportComponentType,
} from '../interface/report-generator/component/rep-component';
import { Point } from '../interface/report-generator/rep-report';

const ToolMouseEventMapper = {
    [ReportComponentType.General]: ReportGeneralEvent,
    [ReportComponentType.Label]: ReportLabelComponentEvent,
    [ReportComponentType.Image]: ReportImageComponentEvent,
    [ReportComponentType.Signature]: ReportSignatureComponentEvent,
    [ReportComponentType.DynamicLabel]: ReportDynamicLabelComponentEvent,
    [ReportComponentType.Line]: ReportLineComponentEvent,
    [ReportComponentType.PageNumber]: ReportPageNumberComponentEvent,
};

export function useRepComponentTool(compType: ReportComponentType = ReportComponentType.General): {
    onGenerate: (e: React.MouseEvent, pos: Point) => RepComponent;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
} {
    const [event, setEvent] = useState(ToolMouseEventMapper[compType] as any);

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
