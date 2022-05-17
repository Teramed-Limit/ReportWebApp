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

        if (containerWidth < containerHeight) {
            const adjustedHeight = (originalHeight * containerWidth) / originalWidth;
            setCanvasWidth(containerWidth);
            setCanvasHeight(adjustedHeight);
            setScale(containerWidth / originalWidth);
        }

        if (containerWidth > containerHeight) {
            const adjustedWidth = (originalWidth * containerHeight) / originalHeight;
            setCanvasWidth(adjustedWidth);
            setCanvasHeight(containerHeight);
            setScale(containerHeight / originalHeight);
        }
    }, [containerHeight, containerWidth, image]);

    return { image, scale, canvasWidth, canvasHeight };
};
