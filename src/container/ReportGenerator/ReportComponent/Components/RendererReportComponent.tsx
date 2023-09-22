import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { ReportComponentMapper } from './report-component-mapper';
import { RepComponent } from '../../../../interface/report-generator/component/rep-component';
import { Point } from '../../../../interface/report-generator/rep-report';

interface Props {
    component: RepComponent;
    scale: number;
    onComponentActive: (comp: RepComponent, deactivateOthers: boolean) => void;
    restrictBoundary: (oriPoint: Point, movePoint: Point, targetRect: DOMRect) => Point;
    onSaveCompPosition: () => void;
    onValueChanged: (uuid: string, attrPath: (string | number)[], value: string) => void;
}

type RepComponentHandle = {
    moveCompPosition: (point: Point) => void;
    getCompPosition: () => Point;
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
                            p,
                            movement,
                            componentRef.current?.getBoundingClientRect(),
                        );
                        return { x: point.x, y: point.y };
                    });
                },
                getCompPosition() {
                    return { x: position.x * scale, y: position.y * scale };
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
            movable.current = true;
            if (isActive) return;
            setIsActive(true);
            onComponentActive(component, !e.shiftKey);
        };

        const onMouseUp = (e: React.MouseEvent) => {
            movable.current = false;
            onSaveCompPosition();
        };

        const onMouseMove = (e: React.MouseEvent) => {};

        const RenderComponent = ReportComponentMapper[component.componentType];
        if (!RenderComponent) return <></>;

        // 更新元件位置
        useEffect(() => {
            setPosition({ x: component.x, y: component.y });
        }, [component.x, component.y]);

        return (
            <RenderComponent
                ref={componentRef}
                style={{
                    position: 'absolute',
                    top: position.y * scale,
                    left: position.x * scale,
                    // outline: '2px dotted',
                    boxShadow: `inset 0 0 0 2px ${isActive ? 'red' : 'black'}`,
                    // outlineColor: isActive ? 'red' : 'black',
                    zIndex: isActive ? 999 : 'unset',
                    boxSizing: 'content-box',
                }}
                scale={scale}
                component={component}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onActive={onComponentActive}
                onValueChanged={onValueChanged}
            />
        );
    },
);

export default React.memo(RendererReportComponent);
