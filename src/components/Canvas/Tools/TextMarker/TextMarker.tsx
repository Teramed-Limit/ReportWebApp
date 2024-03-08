import React, { MutableRefObject, useEffect } from 'react';

import Konva from 'konva';
import { Text } from 'react-konva';

import { useMarkerEvent } from '../../../../hooks/useMarkerEvent';

interface Props {
    id: number;
    attribute: Konva.TextConfig;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onUpdateAttr: (id: number, attr: Konva.ShapeConfig) => void;
}

const TextMarker = React.forwardRef<Konva.Text, Props>(
    ({ id, attribute, isSelected, onSelect, onUpdateAttr }: Props, shapeRef) => {
        const { onClick, onDragStart, onDragEnd, onMouseDown, onMouseLeave, onMouseEnter } =
            useMarkerEvent(
                id,
                isSelected,
                (shapeRef as MutableRefObject<Konva.Text>).current,
                onSelect,
                onUpdateAttr,
            );

        useEffect(() => {
            if (isSelected) {
                (shapeRef as MutableRefObject<Konva.Text>)?.current?.fire('click');
            }
        }, [isSelected, shapeRef]);

        // 點擊Text組件時觸發的函數，讓使用者可以直接在Text的位置上輸入文字
        const handleTextClick = () => {
            const textNode = (shapeRef as MutableRefObject<Konva.Text>)?.current;
            const stage = textNode?.getStage();

            if (!stage) return;

            // 創建一個HTML輸入元素
            const inputArea = document.createElement('input');
            inputArea.type = 'text';
            inputArea.value = textNode.text();
            inputArea.style.position = 'absolute';
            inputArea.style.top = `${
                stage.container().getBoundingClientRect().top + textNode.absolutePosition().y - 30
            }px`;
            inputArea.style.left = `${
                stage.container().getBoundingClientRect().left + textNode.absolutePosition().x
            }px`;
            inputArea.style.transform = 'translateY(-50%)';
            inputArea.style.zIndex = '1300';
            // 設定輸入框的最小寬度並根據輸入內容調整寬度
            inputArea.style.minWidth = '100px'; // 設定最小寬度
            inputArea.style.width = `${Math.max(textNode.width() / 2, 100)}px`; // 根據Text組件的寬度設定輸入框的初始寬度
            inputArea.style.fontSize = `${16}px`;
            inputArea.style.fontFamily = textNode.fontFamily();
            document.body.appendChild(inputArea);

            // 使用一個標誌來檢查元素是否已經被移除
            let isRemoved = false;

            // 輸入完成後移除輸入元素
            inputArea.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!isRemoved) {
                        document.body.removeChild(inputArea);
                        isRemoved = true; // 標記為已移除，避免重複移除
                    }
                    textNode.text(inputArea.value);
                    onUpdateAttr(id, {
                        ...attribute,
                        text: inputArea.value,
                    });
                });
            });

            // 處理按下Enter後的事件，移除輸入元素並更新Text組件的內容
            inputArea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (!isRemoved) {
                        document.body.removeChild(inputArea);
                        isRemoved = true; // 標記為已移除，避免重複移除
                    }
                    textNode.text(inputArea.value);
                    onUpdateAttr(id, {
                        ...attribute,
                        text: inputArea.value,
                    });
                }
            });

            // 立即獲得焦點以便開始輸入
            inputArea.focus();
        };

        return (
            <>
                <Text
                    ref={shapeRef}
                    text={attribute.text}
                    x={attribute.x}
                    y={attribute.y}
                    rotation={attribute.rotation}
                    scaleX={attribute.scaleX}
                    scaleY={attribute.scaleY}
                    fontSize={attribute.fontSize}
                    draggable={isSelected}
                    fill={attribute.fill}
                    stroke={attribute.stroke}
                    onMouseLeave={onMouseLeave}
                    onMouseEnter={onMouseEnter}
                    onMouseDown={(e) => onMouseDown(e)}
                    onClick={(e) => {
                        handleTextClick();
                        onClick(e);
                    }}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    fontFamily="Tahoma"
                    fontStyle="Normal"
                    fontWeight="Normal"
                />
            </>
        );
    },
);

export default TextMarker;
