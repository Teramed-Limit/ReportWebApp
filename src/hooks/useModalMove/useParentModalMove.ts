import React, { useRef } from 'react';

export type MouseEventHandle = React.ElementRef<
    React.ForwardRefExoticComponent<React.RefAttributes<ModalMoveEvent>>
>;

export interface ModalMoveEvent {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
}

export function useParentModalMove() {
    const modalMapRef = useRef({});
    const moveModalRef = useRef<ModalMoveEvent>({ onMouseMove: () => {}, onMouseUp: () => {} });

    const onRegisterMoveModalId = (id: string, ref: ModalMoveEvent | null) => {
        modalMapRef.current[id] = ref;
    };

    const onModalReadyToMove = (id: string) => {
        moveModalRef.current = modalMapRef.current[id];
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!moveModalRef.current) return;
        moveModalRef.current.onMouseMove(e);
    };

    const onMouseUp = (e: React.MouseEvent) => {
        if (!moveModalRef.current) return;
        moveModalRef.current.onMouseMove(e);
    };

    return { onRegisterMoveModalId, onModalReadyToMove, onMouseMove, onMouseUp, moveModalRef };
}
