import React, { CSSProperties, useEffect } from 'react';

import { RepLineComponent } from '../../../../../interface/report-generator/component/rep-line-component';

interface Props {
    style: CSSProperties;
    scale: number;
    component: RepLineComponent;
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
}

const ReportLineComponent = React.forwardRef<HTMLCanvasElement, Props>(
    (
        {
            style,
            scale,
            component,
            onClick,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseEnter,
            onMouseLeave,
        }: Props,
        ref,
    ) => {
        useEffect(() => {
            if (!ref) return;
            const canvas = (ref as React.MutableRefObject<HTMLCanvasElement>).current;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;
            ctx.clearRect(0, 0, component.width * scale, component.height * scale);
            ctx.beginPath();
            ctx.moveTo(component.x1 * scale, component.y1 * scale);
            ctx.lineTo(component.x2 * scale, component.y2 * scale);
            ctx.lineWidth = component.thickness;
            ctx.strokeStyle = component.color;
            ctx.stroke();
        }, [
            component.color,
            component.height,
            component.thickness,
            component.width,
            component.x1,
            component.x2,
            component.y1,
            component.y2,
            ref,
            scale,
        ]);

        return (
            <canvas
                ref={ref}
                width={component.width * scale}
                height={component.height * scale}
                style={{ ...style, stroke: component.color }}
                onClick={onClick}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        );
    },
);

export default React.memo(ReportLineComponent);
