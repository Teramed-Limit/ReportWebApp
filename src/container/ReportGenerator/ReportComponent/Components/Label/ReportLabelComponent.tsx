import React, { CSSProperties } from 'react';

import { RepLabelComponent } from '../../../../../interface/rep-report';

interface Props {
    style: CSSProperties;
    scale: number;
    component: RepLabelComponent;
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
}

const ReportLabelComponent = React.forwardRef<HTMLDivElement, Props>(
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
        return (
            <div
                ref={ref}
                style={{
                    ...style,
                    lineHeight: `${component.fontSize}px`,
                    fontSize: `${component.fontSize}px`,
                    fontFamily: component.fontName || 'Noto Sans TC',
                    fontWeight: component.fontWeight,
                    fontStyle: component.fontStyle,
                    color: component.fontColor,
                }}
                onClick={onClick}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {component.value}
            </div>
        );
    },
);

export default React.memo(ReportLabelComponent);
