import React, { useRef, useState } from 'react';

import * as R from 'ramda';
import { useRecoilState, useRecoilValue } from 'recoil';

import { reportSelectedTool, reportZoomState } from '../../../../atom/report-generator';
import { useRepComponentTool } from '../../../../hooks/useRepComponentTool';
import { Point, RepComponent, RepPage, Size } from '../../../../interface/rep-report';
import { generateUUID } from '../../../../utils/general';
import RendererReportComponent from '../../ReportComponent/RendererReportComponent';
import { ReportComponentType } from '../../ReportComponent/report-component-mapper';
import classes from './ReportPage.module.scss';

const PaperSizeMapper = {
    A4: { width: 595, height: 842 },
};

interface Props {
    page: RepPage;
    setPage: React.Dispatch<React.SetStateAction<RepPage>>;
    setPageActive: React.Dispatch<React.SetStateAction<string>>;
    setActiveCompAttribute: (uuid: string) => void;
    onCompValueChanged: (uuid: string, value: string) => void;
}

type RepComponentHandle = React.ElementRef<typeof RendererReportComponent>;

const ReportPage = ({
    page,
    setPage,
    setActiveCompAttribute,
    setPageActive,
    onCompValueChanged,
}: Props) => {
    // Page
    const pageRef = useRef<HTMLDivElement | null>(null);
    const reportZoom = useRecoilValue(reportZoomState);
    const [pageSize] = useState<Size>({
        width: PaperSizeMapper.A4.width,
        height: 105 /*PaperSizeMapper.A4.height*/,
    });
    // Tool
    const [activeTool, setSelectedTool] = useRecoilState(reportSelectedTool);
    const { onGenerate } = useRepComponentTool(activeTool);
    // Moving state
    let isMoving = useRef(false).current;
    let startMove = useRef(false).current;
    // Components
    const repComponentRef = useRef<Record<string, RepComponentHandle>>({});
    const activeComponentRef = useRef<Record<string, RepComponent>>({});
    const copyComponentRef = useRef<Record<string, RepComponent>>({});

    const restrictBoundary = (point: Point, targetRect: DOMRect): Point => {
        if (point.x <= 0) point.x = 0;

        if (point.x >= pageSize.width * reportZoom - targetRect.width)
            point.x = pageSize.width * reportZoom - targetRect.width;

        if (point.y <= 0) point.y = 0;

        if (point.y >= pageSize.height * reportZoom - targetRect.height)
            point.y = pageSize.height * reportZoom - targetRect.height;

        return point;
    };

    const calculateMouseToPageActuallyPos = (e: React.MouseEvent): Point => {
        if (!pageRef.current) return { x: 0, y: 0 };
        const boundingClientRect = pageRef.current?.getBoundingClientRect();
        const x = e.pageX - boundingClientRect.x;
        const y = e.pageY - boundingClientRect.y;
        return { x, y };
    };

    const onSaveCompPosition = (pos: Point, comp: RepComponent) => {
        setPage((prev) => {
            const movedComp = prev.components[comp.uuid];
            return {
                ...prev,
                components: R.assocPath(
                    [comp.uuid],
                    { ...movedComp, x: pos.x, y: pos.y },
                    prev.components,
                ),
            };
        });
    };

    // 標記所有元件停止動作
    const deactivateAllComponent = () => {
        // deactivate other comp
        activeComponentRef.current = {};
        Object.keys(repComponentRef.current)?.forEach((uuid) => {
            repComponentRef.current[uuid].deactivateComp();
        });
    };

    // Active選中的原件，和是否停用所有元件
    const activateComponent = (comp: RepComponent, deactivateOthers: boolean) => {
        if (deactivateOthers) deactivateAllComponent();
        activeComponentRef.current[comp.uuid] = comp;
        Object.keys(repComponentRef.current).forEach((uuid) => {
            if (comp.uuid === uuid) {
                repComponentRef.current[uuid].activeComp();
                return;
            }
        });
    };

    const onMouseDown = (e: React.MouseEvent) => {
        // 只要屬標在其中一個Active的元件上，就標記可以移動
        startMove = Object.keys(activeComponentRef.current)?.some((uuid) => {
            return repComponentRef.current[uuid].movable();
        });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        // 移動標記檢查
        if (!startMove) return;
        // 標記正在移動中
        isMoving = true;
        // 元件位移增減通知
        Object.keys(activeComponentRef.current)?.forEach((uuid) => {
            repComponentRef.current[uuid].moveCompPosition({
                x: e.movementX,
                y: e.movementY,
            });
        });
    };

    const onMouseUp = (e: React.MouseEvent) => {
        // 標記移動中不插入元件至報告中
        if (!isMoving && !startMove) {
            // deactivate others
            deactivateAllComponent();
            // 新增元件到Page上
            const addedComp = onGenerate(e, calculateMouseToPageActuallyPos(e));
            if (!addedComp) return;
            setPage((p) => ({
                ...p,
                components: R.assocPath([addedComp.uuid], addedComp, p.components),
            }));
            activateComponent(addedComp, false);
            setSelectedTool(ReportComponentType.General);
        }
        // 標記移動中止
        isMoving = false;
        startMove = false;
    };

    const onMouseLeave = (e: React.MouseEvent) => {
        // startMove.current = false;
        isMoving = false;
        deactivateAllComponent();
    };

    const onClick = (e: React.MouseEvent) => {
        setPageActive(page.name);
        setActiveCompAttribute(Object.values(activeComponentRef.current)[0]?.uuid);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.ctrlKey) {
            // 複製
            if (e.code === 'KeyC') {
                copyComponentRef.current = activeComponentRef.current;
            }
            // 貼上
            if (e.code === 'KeyV') {
                setPage((prev) => {
                    Object.values(copyComponentRef.current).forEach((v) => {
                        const addComp = {
                            ...v,
                            uuid: generateUUID(),
                            x: v.x + 15,
                            y: v.y + 15,
                        } as RepComponent;
                        prev = R.assocPath(['components', addComp.uuid], addComp, prev);
                    });
                    return prev;
                });
                deactivateAllComponent();
            }
        }
        // 刪除
        if (e.code === 'Delete') {
            const cache = { ...activeComponentRef.current };
            deactivateAllComponent();
            setPage((prev) => {
                Object.values(cache).forEach((comp) => {
                    delete repComponentRef.current[comp.uuid];
                    prev = R.dissocPath(['components', comp.uuid], prev);
                });
                return prev;
            });
        }
    };

    return (
        <div
            ref={pageRef}
            style={{
                width: pageSize.width * reportZoom,
                height: pageSize.height * reportZoom,
            }}
            className={classes.page}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onKeyDown={onKeyDown}
            tabIndex={-1}
        >
            {Object.entries(page.components || {})?.map(([uuid, comp]) => {
                return (
                    <RendererReportComponent
                        key={uuid}
                        ref={(ref) => {
                            if (!ref) return;
                            repComponentRef.current[comp.uuid] = ref as RepComponentHandle;
                        }}
                        scale={reportZoom}
                        component={comp}
                        onComponentActive={activateComponent}
                        onSaveCompPosition={onSaveCompPosition}
                        onValueChanged={onCompValueChanged}
                        restrictBoundary={restrictBoundary}
                    />
                );
            })}
        </div>
    );
};

export default ReportPage;
