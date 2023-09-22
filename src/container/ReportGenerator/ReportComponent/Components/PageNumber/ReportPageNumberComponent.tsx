import React, { CSSProperties } from 'react';

import { RepPageNumberComponent } from '../../../../../interface/report-generator/component/rep-page-num-component';

interface Props {
    style: CSSProperties;
    scale: number;
    component: RepPageNumberComponent;
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
}

const ReportPageNumberComponent = React.forwardRef<HTMLDivElement, Props>(
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
                    fontSize: `${component.fontSize * scale}px`,
                    fontFamily: component.fontName || 'Arial',
                    fontWeight: component.fontWeight,
                    fontStyle: component.fontStyle,
                    color: component.fontColor,
                    whiteSpace: 'nowrap',
                }}
                onClick={onClick}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {`1${component.showTotalPages ? '/1' : ''}`}
            </div>
        );
    },
);

export default React.memo(ReportPageNumberComponent);
