import React, { useCallback, useLayoutEffect, useState } from 'react';

import { Menu, MenuItem } from '@mui/material';

import { ReportMark } from '../../interface/document-data';
import {
    ImageMarker,
    ImagePosition,
    MarkerPoint,
    MarkerPosition,
    MousePosition,
} from '../../interface/marker';
import classes from './MarkerCanvas.module.scss';

const DEFAULT_BUFFER = 10;

const initialMenuState = {
    mouseX: null,
    mouseY: null,
};

const getItemPosition = (marker: MarkerPosition) => {
    return {
        top: `${marker.top}%`,
        left: `${marker.left}%`,
    };
};

const calculateMarkerPosition = (
    mousePosition: MousePosition,
    imagePosition: ImagePosition,
    scrollY: number,
    bufferLeft: number,
    bufferTop: number,
) => {
    const pixelsLeft = mousePosition.clientX - imagePosition.left;
    let pixelsTop;
    if (imagePosition.top < 0) {
        pixelsTop = mousePosition.pageY - scrollY + imagePosition.top * -1;
    } else {
        pixelsTop = mousePosition.pageY - scrollY - imagePosition.top;
    }
    const top = ((pixelsTop - bufferTop) * 100) / imagePosition.height;
    const left = ((pixelsLeft - bufferLeft) * 100) / imagePosition.width;

    return { top, left, pixelsTop, pixelsLeft };
};

interface Props {
    src: string;
    reportMarkers: ReportMark[];
    onAddMarker: (marker: MarkerPoint, sopInstanceUID: string) => void;
    onDeleteMarker: (marker: ImageMarker) => void;
    bufferLeft?: number;
    bufferTop?: number;
    alt?: string;
    disabled: boolean;
}
const MarkerCanvas = ({
    src,
    reportMarkers,
    onAddMarker,
    onDeleteMarker,
    bufferLeft = DEFAULT_BUFFER,
    bufferTop = DEFAULT_BUFFER,
    alt = 'Markers',
    disabled,
}: Props) => {
    const imageRef = React.useRef<HTMLImageElement>(null);
    const [canvasMarkers, setCanvasMarkers] = useState<ImageMarker[]>([]);
    const [activeMarker, setActiveMarker] = useState<ImageMarker | undefined>(undefined);
    const [menuPos, setMenuPos] = React.useState<{
        mouseX: null | number;
        mouseY: null | number;
    }>(initialMenuState);

    const openContextMenu = (event: React.MouseEvent, marker: ImageMarker) => {
        if (disabled) return;
        event.preventDefault();
        event.stopPropagation();
        setActiveMarker(marker);
        setMenuPos({
            mouseX: event.clientX + 8,
            mouseY: event.clientY + 8,
        });
    };

    const closeContextMenu = () => {
        setActiveMarker(undefined);
        setMenuPos(initialMenuState);
    };

    const onDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!imageRef.current) {
            return;
        }
        const imageDimensions = imageRef.current.getBoundingClientRect();
        const wRatio = imageDimensions.width / imageRef.current.naturalWidth;
        const hRatio = imageDimensions.height / imageRef.current.naturalHeight;

        const { pixelsTop, pixelsLeft } = calculateMarkerPosition(
            event,
            imageDimensions,
            window.scrollY,
            bufferLeft,
            bufferTop,
        );

        onAddMarker(
            {
                PointX: pixelsLeft / hRatio / 1.8,
                PointY: pixelsTop / wRatio / 1.8,
                PointInImageX: pixelsLeft / hRatio,
                PointInImageY: pixelsTop / wRatio,
            },
            event.dataTransfer.getData('sopInsUid'),
        );
    };

    const onDeleteMark = () => {
        if (!activeMarker) return;
        onDeleteMarker(activeMarker);
        closeContextMenu();
    };

    const setMarkerOnCanvas = useCallback(() => {
        if (!imageRef.current) {
            return;
        }
        const imageDimensions = imageRef.current.getBoundingClientRect();
        const wRatio = imageDimensions.width / imageRef.current.naturalWidth;
        const hRatio = imageDimensions.height / imageRef.current.naturalHeight;

        setCanvasMarkers(
            reportMarkers
                .filter((marker) => !!marker)
                .map((marker) => {
                    const top =
                        ((marker.PointInImageY * hRatio - bufferTop) * 100) /
                        imageDimensions.height;
                    const left =
                        ((marker.PointInImageX * wRatio - bufferLeft) * 100) /
                        imageDimensions.width;

                    return {
                        id: marker.SOPInstanceUID,
                        markerText: marker.MappingNumber.toString(),
                        top,
                        left,
                        PointX: marker.PointX,
                        PointY: marker.PointY,
                        PointInImageX: marker.PointInImageX,
                        PointInImageY: marker.PointInImageY,
                    };
                }),
        );
    }, [bufferLeft, bufferTop, reportMarkers]);

    useLayoutEffect(() => {
        setMarkerOnCanvas();
    }, [setMarkerOnCanvas]);

    return (
        <div
            className={classes.imageMarker}
            onContextMenu={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}
            onDragOver={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}
            onDrop={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onDrop(event);
            }}
        >
            <img
                id="diagram"
                src={src}
                alt={alt}
                ref={imageRef}
                onLoad={() => setMarkerOnCanvas()}
                draggable={false}
            />
            {canvasMarkers.map((marker) => (
                <div
                    key={marker.id}
                    onContextMenu={(event) => openContextMenu(event, marker)}
                    className={classes.marker}
                    style={getItemPosition(marker)}
                    data-testid="marker"
                >
                    {marker.markerText}
                </div>
            ))}

            <Menu
                classes={{ paper: classes.menu }}
                open={menuPos.mouseY !== null}
                onClose={closeContextMenu}
                transitionDuration={0}
                anchorReference="anchorPosition"
                anchorPosition={
                    menuPos.mouseY !== null && menuPos.mouseX !== null
                        ? { top: menuPos.mouseY, left: menuPos.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={() => onDeleteMark()}>Delete</MenuItem>
            </Menu>
        </div>
    );
};

export default MarkerCanvas;
