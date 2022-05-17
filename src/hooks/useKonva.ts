import React, { useImperativeHandle } from 'react';

import Konva from 'konva';

import { emptyBaseImage } from '../utils/general';

export const useKonva = (ref) => {
    const stageRef = React.useRef<Konva.Stage>(null);
    const imageRef = React.useRef<Konva.Image>(null);

    useImperativeHandle(
        ref,
        () => ({
            onExport(): string {
                if (
                    !stageRef.current ||
                    !imageRef.current ||
                    stageRef.current.width() === 0 ||
                    stageRef.current.height() === 0
                )
                    return emptyBaseImage();

                let ratio = 1;
                if (stageRef.current.height() < stageRef.current.width()) {
                    ratio = imageRef.current.height() / stageRef.current.height();
                }

                if (stageRef.current.height() > stageRef.current.width()) {
                    ratio = imageRef.current.width() / stageRef.current.width();
                }

                return stageRef?.current?.toDataURL({
                    mimeType: 'image/jpeg',
                    pixelRatio: ratio,
                });
            },
        }),
        [],
    );

    return { stageRef, imageRef };
};
