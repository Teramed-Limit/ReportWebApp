import React, { useImperativeHandle, useRef, useState } from 'react';

import { ModalMoveEvent } from './useParentModalMove';

export function useChildModalMove(
    forwardRef: React.ForwardedRef<ModalMoveEvent>,
    position: { left: number; top: number },
) {
    const [modalPosition, setModalPosition] = useState({
        left: position.left,
        top: position.top,
    });

    const moveElementRef = useRef<HTMLDivElement | null>(null);
    const canMoveRef = useRef(false);
    const offsetRef = useRef({ left: 0, top: 0 });

    const onMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!moveElementRef?.current) return;
        canMoveRef.current = true;
        offsetRef.current = {
            left: moveElementRef.current.offsetLeft - e.clientX,
            top: moveElementRef.current.offsetTop - e.clientY,
        };
    };

    const onMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        canMoveRef.current = false;
    };

    useImperativeHandle(forwardRef, () => ({
        onMouseMove: (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!canMoveRef.current) return;
            if (!offsetRef.current) return;

            const mousePosition = {
                x: e.clientX,
                y: e.clientY,
            };

            setModalPosition({
                left: mousePosition.x + offsetRef.current.left,
                top: mousePosition.y + offsetRef.current.top,
            });
        },
        onMouseUp: (e: React.MouseEvent) => {
            e.stopPropagation();
            canMoveRef.current = true;
        },
    }));

    return { modalPosition, moveElementRef, onMouseDown, onMouseUp };
}
