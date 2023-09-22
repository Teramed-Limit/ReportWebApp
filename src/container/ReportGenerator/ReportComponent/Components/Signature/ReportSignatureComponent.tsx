import React, { CSSProperties } from 'react';

import { RepImageComponent } from '../../../../../interface/report-generator/component/rep-image-component';

interface Props {
    style: CSSProperties;
    scale: number;
    component: RepImageComponent;
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
}

const ReportSignatureComponent = React.forwardRef<HTMLImageElement, Props>(
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
            <>
                <img
                    draggable="false"
                    ref={ref}
                    style={{
                        ...style,
                        width: component.width * scale,
                        height: component.height * scale,
                        objectFit: 'contain',
                    }}
                    onClick={onClick}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    src=""
                    alt=""
                />
            </>
        );
    },
);

export default ReportSignatureComponent;
