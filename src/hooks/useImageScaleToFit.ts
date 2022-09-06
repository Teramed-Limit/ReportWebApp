import { useLayoutEffect, useState } from 'react';

import useImage from 'use-image';

export const useImageScaleToFit = (
    src: string,
    containerWidth: number,
    containerHeight: number,
) => {
    const [image] = useImage(src, 'anonymous');
    const [scale, setScale] = useState(1);
    const [canvasWidth, setCanvasWidth] = useState(containerWidth);
    const [canvasHeight, setCanvasHeight] = useState(containerHeight);

    // calculate scale of image and container
    useLayoutEffect(() => {
        const originalWidth = image?.naturalWidth || 0;
        const originalHeight = image?.naturalHeight || 0;

        if (originalWidth === 0 || originalHeight === 0) return;

        let adjustWidth = originalWidth;
        let adjustHeight = originalHeight;
        let adjustScale = 1;
        while (containerHeight < adjustHeight || containerWidth < adjustWidth) {
            adjustWidth *= 0.95;
            adjustHeight *= 0.95;
            adjustScale *= 0.95;
        }
        setCanvasWidth(adjustWidth);
        setCanvasHeight(adjustHeight);
        setScale(adjustScale);

        // if (containerWidth < containerHeight) {
        //     const adjustedHeight = (originalHeight * containerWidth) / originalWidth;
        //     if (containerHeight < adjustedHeight) {
        //         const adjustScale = containerHeight / adjustedHeight;
        //         setCanvasWidth(containerWidth * adjustScale);
        //         setCanvasHeight(adjustedHeight * adjustScale);
        //         setScale((containerWidth / originalWidth) * adjustScale);
        //     } else {
        //         setCanvasWidth(containerWidth);
        //         setCanvasHeight(adjustedHeight);
        //         setScale(containerWidth / originalWidth);
        //     }
        // }
        //
        // if (containerWidth > containerHeight) {
        //     const adjustedWidth = (originalWidth * containerHeight) / originalHeight;
        //     if (adjustedWidth < containerWidth) {
        //         const adjustScale = containerWidth / adjustedWidth;
        //         setCanvasWidth(adjustedWidth * adjustScale);
        //         setCanvasHeight(containerHeight * adjustScale);
        //         setScale((containerHeight / originalHeight) * adjustScale);
        //     } else {
        //         setCanvasWidth(adjustedWidth);
        //         setCanvasHeight(containerHeight);
        //         setScale(containerHeight / originalHeight);
        //     }
        // }
    }, [containerHeight, containerWidth, image]);

    return { image, scale, canvasWidth, canvasHeight };
};
