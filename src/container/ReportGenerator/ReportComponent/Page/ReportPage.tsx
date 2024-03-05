import React, { useRef, useState } from 'react';

import * as R from 'ramda';
import { useRecoilState } from 'recoil';

import PagePaddingPseudo from './PagePaddingPseudo/PagePaddingPseudo'; // const PaperSizeMapper = {
import classes from './ReportPage.module.scss';
import { reportSelectedToolAtom } from '../../../../atom/report-generator';
import { useRepComponentTool } from '../../../../hooks/useRepComponentTool';
import {
    RepComponent,
    ReportComponentType,
} from '../../../../interface/report-generator/component/rep-component';
import { RepPage } from '../../../../interface/report-generator/rep-page';
import { Point } from '../../../../interface/report-generator/rep-report';
import { generateUUID } from '../../../../utils/general';
import RendererReportComponent from '../Components/RendererReportComponent';

interface Props {
    page: RepPage;
    setPage: React.Dispatch<React.SetStateAction<RepPage>>;
    setPageActive: React.Dispatch<React.SetStateAction<string>>;
    setActiveCompAttribute: (uuid: string) => void;
    onCompValueChanged: (uuid: string, attrPath: (string | number)[], value: string) => void;
}

type RepComponentHandle = React.ElementRef<typeof RendererReportComponent>;

const ReportPage = ({
    page,
    setPage,
    setActiveCompAttribute,
    setPageActive,
    onCompValueChanged,
}: Props) => {
    // 使用 useRef 建立 ref 變數，用於獲取並操作 DOM 元素
    const pageRef = useRef<HTMLDivElement | null>(null);

    // 用於縮放頁面，映射到PDF是寬度是595px，但實際上在網頁寬度是794px(210mm)
    const [scale] = useState(1.332773109243697);

    // 正在使用的元件
    const [activeTool, setSelectedTool] = useRecoilState(reportSelectedToolAtom);
    const { onGenerate } = useRepComponentTool(activeTool);

    // 移動狀態
    const isMoving = useRef(false);
    const startMove = useRef(false);

    // 定義元件的 ref 和狀態
    const repComponentRef = useRef<Record<string, RepComponentHandle>>({});
    const activeComponentRef = useRef<Record<string, RepComponent>>({});
    const copyComponentRef = useRef<Record<string, RepComponent>>({});

    // 確定元素在頁面上的位置是否超出邊界
    const restrictBoundary = (oriPoint: Point, movePoint: Point, targetRect: DOMRect): Point => {
        const destPoint = {
            x: oriPoint.x + movePoint.x / scale,
            y: oriPoint.y + movePoint.y / scale,
        };

        if (destPoint.x < 0) destPoint.x = 0;
        if (destPoint.y < 0) destPoint.y = 0;

        if (destPoint.x <= page.paddingLeft / scale) destPoint.x = page.paddingLeft / scale;
        if (destPoint.y <= page.paddingTop / scale) destPoint.y = page.paddingTop / scale;

        if (destPoint.x >= page.width - targetRect.width / scale - page.paddingRight / scale)
            destPoint.x = page.width - targetRect.width / scale - page.paddingRight / scale;

        if (destPoint.y > page.height - targetRect.height / scale - page.paddingBottom / 2)
            destPoint.y = page.height - targetRect.height / scale - page.paddingBottom / 2;

        return destPoint;
    };

    // 計算滑鼠在實際頁面上的位置
    const calculateMouseToPageActuallyPos = (e: React.MouseEvent): Point => {
        if (!pageRef.current) return { x: 0, y: 0 };
        const boundingClientRect = pageRef.current?.getBoundingClientRect();
        const x = e.pageX - boundingClientRect.x;
        const y = e.pageY - boundingClientRect.y;
        return { x: x / scale, y: y / scale };
    };

    const onSaveCompPosition = () => {
        setPage((prev) => {
            // 淺拷貝
            let newPage = { ...prev };

            Object.keys(activeComponentRef.current)?.forEach((uuid) => {
                // 獲取指定組件的位置
                const pos = repComponentRef.current[uuid].getCompPosition();

                // 獲取新頁面物件中的指定組件
                const comp = newPage.components[uuid];

                // 更新新頁面物件中的指定組件
                newPage = {
                    ...newPage,
                    components: R.assocPath(
                        [uuid],
                        { ...comp, x: pos.x / scale, y: pos.y / scale },
                        newPage.components,
                    ),
                };
            });

            // 回傳更新後的新頁面物件
            return newPage;
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
            }
        });
    };

    const onMouseDown = (e: React.MouseEvent) => {
        // 標記移動中止
        isMoving.current = false;
        // 宣告Active的Page
        setPageActive(page.name);
        // 宣告Active的元件
        setActiveCompAttribute(Object.values(activeComponentRef.current)[0]?.uuid);
        // 只要屬標在其中一個Active的元件上，就標記可以移動
        startMove.current = Object.keys(activeComponentRef.current)?.some((uuid) => {
            return repComponentRef.current[uuid].movable();
        });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        // 移動標記檢查
        if (!startMove.current) return;

        // 標記正在移動中
        isMoving.current = true;
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
        if (!isMoving.current) {
            // 新增元件到Page上
            const addedComp = onGenerate(e, calculateMouseToPageActuallyPos(e));
            if (addedComp) {
                // deactivate others
                deactivateAllComponent();
                setPage((p) => ({
                    ...p,
                    components: R.assocPath([addedComp.uuid], addedComp, p.components),
                }));
                activateComponent(addedComp, false);
                setSelectedTool(ReportComponentType.General);
            }
        }
        isMoving.current = false;
        startMove.current = false;
    };

    const onMouseLeave = (e: React.MouseEvent) => {
        isMoving.current = false;
        startMove.current = false;
        onSaveCompPosition();
    };

    const onClick = (e: React.MouseEvent) => {
        setPageActive(page.name);
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
                    const updatedPage = { ...prev };
                    Object.values(copyComponentRef.current).forEach((v) => {
                        const addComp = {
                            ...v,
                            uuid: generateUUID(),
                            x: v.x + 15,
                            y: v.y + 15,
                        } as RepComponent;
                        updatedPage.components[addComp.uuid] = addComp;
                    });
                    return updatedPage;
                });
                deactivateAllComponent();
            }
        }
        // 刪除
        if (e.code === 'Delete') {
            const cache = { ...activeComponentRef.current };
            deactivateAllComponent();
            setPage((prev) => {
                const updatedPage = { ...prev };
                Object.values(cache).forEach((comp) => {
                    delete repComponentRef.current[comp.uuid];
                    delete updatedPage.components[comp.uuid];
                });
                return updatedPage;
            });
        }
    };

    return (
        <div
            ref={pageRef}
            style={{
                width: page.width * scale,
                height: page.height * scale,
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
            <PagePaddingPseudo
                paddingRight={page.paddingRight}
                paddingTop={page.paddingTop}
                paddingBottom={page.paddingBottom}
                paddingLeft={page.paddingLeft}
            />
            {page.components &&
                Object.entries(page.components).map(([uuid, comp]) => {
                    return (
                        <RendererReportComponent
                            key={uuid}
                            ref={(ref) => {
                                if (!ref) return;
                                repComponentRef.current[comp.uuid] = ref as RepComponentHandle;
                            }}
                            scale={scale}
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