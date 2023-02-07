import React, { useImperativeHandle, useRef, useState } from 'react';

import { Point, RepComponent } from '../../../interface/rep-report';
import { ReportComponentMapper } from './report-component-mapper';

interface Props {
    component: RepComponent;
    scale: number;
    onComponentActive: (comp: RepComponent, deactivateOthers: boolean) => void;
    restrictBoundary: (point: Point, targetRect: DOMRect) => Point;
    onSaveCompPosition: (pos: Point, comp: RepComponent) => void;
    onValueChanged: (uuid: string, value: string) => void;
}

type RepComponentHandle = {
    moveCompPosition: (point: Point) => void;
    activeComp: () => void;
    deactivateComp: () => void;
    movable: () => boolean;
};

const RendererReportComponent = React.forwardRef<RepComponentHandle, Props>(
    (
        {
            component,
            scale,
            onValueChanged,
            onComponentActive,
            restrictBoundary,
            onSaveCompPosition,
        }: Props,
        ref,
    ) => {
        const [position, setPosition] = useState({ x: component.x, y: component.y });
        const [isActive, setIsActive] = useState(false);
        const componentRef = useRef<Element>();
        const movable = useRef<boolean>(false);

        useImperativeHandle(ref, () => {
            return {
                moveCompPosition(movement: Point) {
                    setPosition((p) => {
                        if (!componentRef.current) return p;
                        const point = restrictBoundary(
                            { x: p.x + movement.x, y: p.y + movement.y },
                            componentRef.current?.getBoundingClientRect(),
                        );
                        return { x: point.x, y: point.y };
                    });
                },
                activeComp() {
                    setIsActive(true);
                },
                deactivateComp() {
                    setIsActive(false);
                },
                movable() {
                    return movable.current;
                },
            };
        });

        const onMouseDown = (e: React.MouseEvent) => {
            if (isActive) return;
            setIsActive(true);
            onComponentActive(component, !e.shiftKey);
        };

        const onMouseMove = (e: React.MouseEvent) => {};

        const onMouseUp = (e: React.MouseEvent) => {
            onSaveCompPosition(position, component);
        };

        const onClick = (e: React.MouseEvent) => {};

        const onMouseEnter = (e: React.MouseEvent) => {
            movable.current = true;
        };

        const onMouseLeave = (e: React.MouseEvent) => {
            movable.current = false;
            onSaveCompPosition(position, component);
        };

        const RenderComponent = ReportComponentMapper[component.componentType];
        if (!RenderComponent) return <></>;

        return (
            <RenderComponent
                ref={componentRef}
                style={{
                    position: 'absolute',
                    top: position.y,
                    left: position.x,
                    outline: '2px dotted',
                    outlineColor: isActive ? 'red' : 'black',
                    zIndex: isActive ? 999 : 'unset',
                    boxSizing: 'content-box',
                }}
                scale={scale}
                component={component}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onValueChanged={onValueChanged}
            />
        );
    },
);

export default React.memo(RendererReportComponent);
