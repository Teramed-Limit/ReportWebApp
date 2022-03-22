import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import cx from 'classnames';
import { useVirtual } from 'react-virtual';

import { getBoundingClientObj } from '../utils';
import classes from './MenuGroup.module.scss';

interface Props {
    children: React.ReactNode;
    optionsLength: number;
    focusOptionIndex: number;
    maxMenuGroupHeight: number;
    minMenuGroupWidth: number;
    singleMenuHeight: number;
    anchorElement: HTMLElement;
}

const MenuGroup = ({
    children,
    optionsLength,
    focusOptionIndex,
    maxMenuGroupHeight,
    minMenuGroupWidth,
    singleMenuHeight,
    anchorElement,
}: Props) => {
    const menuListRef = useRef() as React.MutableRefObject<HTMLDivElement>;

    const [, setMenuGroupMinHeight] = useState(singleMenuHeight);
    const [cssStyle, setCSSStyle] = useState<React.CSSProperties>({
        position: 'fixed',
    });

    const optionVirtualizer = useVirtual({
        size: optionsLength,
        parentRef: menuListRef,
        estimateSize: React.useCallback(() => singleMenuHeight, [singleMenuHeight]),
        overscan: 3,
    });

    const virtualizerRef = useRef(optionVirtualizer);

    useEffect(() => {
        virtualizerRef.current = optionVirtualizer;
    }, [optionVirtualizer]);

    useLayoutEffect(() => {
        if (optionsLength < 10) {
            setMenuGroupMinHeight(singleMenuHeight * optionsLength || singleMenuHeight);
            return;
        }
        setMenuGroupMinHeight(maxMenuGroupHeight);
    }, [maxMenuGroupHeight, optionsLength, singleMenuHeight]);

    useLayoutEffect(() => {
        const { virtualItems } = virtualizerRef.current;
        if (!virtualItems || virtualItems.length === 0) {
            return;
        }

        virtualizerRef.current.scrollToIndex(focusOptionIndex);
    }, [focusOptionIndex]);

    useLayoutEffect(() => {
        const anchorElementRect = getBoundingClientObj(anchorElement);

        const marginBottom = parseInt(getComputedStyle(menuListRef.current).marginBottom, 10);

        const viewHeight = window.innerHeight;
        const viewWidth = window.innerWidth;
        const viewSpaceBelow = viewHeight - anchorElementRect.bottom;
        const viewSpaceRight = viewWidth - anchorElementRect.left;

        const position = 'fixed';
        const zIndex = 999;
        const { width } = anchorElementRect;
        let { left, top } = { left: 0, top: 0 };

        top =
            viewSpaceBelow <= maxMenuGroupHeight
                ? anchorElementRect.top -
                  marginBottom * 2 -
                  Math.min(singleMenuHeight * optionsLength, maxMenuGroupHeight)
                : anchorElementRect.bottom;
        left =
            viewSpaceRight <= minMenuGroupWidth
                ? anchorElementRect.left + viewSpaceRight - minMenuGroupWidth - 4
                : anchorElementRect.left;

        setCSSStyle({ left, top, width, position, zIndex });
    }, [
        anchorElement,
        maxMenuGroupHeight,
        menuListRef,
        minMenuGroupWidth,
        optionsLength,
        singleMenuHeight,
    ]);

    return (
        <>
            {createPortal(
                <div className={classes.wrapper} style={cssStyle as React.CSSProperties}>
                    <div className={classes.scrollBlocker} />
                    <div
                        ref={menuListRef}
                        style={{
                            minHeight: `${singleMenuHeight}px`,
                            maxHeight: `${maxMenuGroupHeight}px`,
                            minWidth: `${minMenuGroupWidth}px`,
                        }}
                        className={cx(classes.menuContainer)}
                    >
                        <div
                            id="report__menu-list"
                            style={{
                                height: `${optionVirtualizer.totalSize}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                            className={classes.menuList}
                        >
                            {optionVirtualizer.virtualItems.map((virtualRow) => (
                                <div
                                    key={virtualRow.index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: 'inherit',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {children?.[virtualRow.index]}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
};

export default MenuGroup;
