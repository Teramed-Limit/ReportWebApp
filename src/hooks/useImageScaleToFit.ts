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
    const [originalWidth, setOriginalWidth] = useState(0);
    const [originalHeight, setOriginalHeight] = useState(0);

    // calculate scale of image and container
    useLayoutEffect(() => {
        // 獲取原始圖片的尺寸
        const oriWidth = image?.naturalWidth || 0;
        const oriHeight = image?.naturalHeight || 0;

        setOriginalWidth(oriWidth);
        setOriginalHeight(oriHeight);

        if (originalWidth === 0 || originalHeight === 0) return;
        if (containerWidth === 0 || containerHeight === 0) return;

        // 計算寬度和高度的縮放比例
        const scaleWidth = containerWidth / originalWidth;
        const scaleHeight = containerHeight / originalHeight;

        // 選擇較小的縮放比例作為最終縮放比例
        const ratio = Math.min(scaleWidth, scaleHeight);

        // 設置圖片的新寬度和高度
        setCanvasWidth(originalWidth * ratio);
        setCanvasHeight(originalHeight * ratio);
        setScale(ratio);
    }, [containerHeight, containerWidth, image, originalHeight, originalWidth, src]);

    return { image, scale, canvasWidth, canvasHeight, originalWidth, originalHeight };
};
