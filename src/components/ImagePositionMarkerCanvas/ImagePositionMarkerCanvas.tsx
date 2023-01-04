import React, { forwardRef } from 'react';

import { Menu, MenuItem } from '@mui/material';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Image, Layer, Rect, Stage, Text } from 'react-konva';

import { useImageScaleToFit } from '../../hooks/useImageScaleToFit';
import { useKonva } from '../../hooks/useKonva';
import { CanvasMarker } from '../../interface/canvas-maker-attribute';
import { ReportMark } from '../../interface/document-data';
import { CanvasHandle } from '../../interface/konva-stage-event';
import { MarkerPoint } from '../../interface/marker';
import classes from '../Canvas/Canvas.module.scss';
import RenderMaker from '../Canvas/Tools/RenderMaker/RenderMaker';

interface Props {
    src: string;
    imagePositionMarkers: ReportMark[];
    canvasMarkers: CanvasMarker<Konva.ShapeConfig>[];
    containerWidth: number;
    containerHeight: number;
    disabled: boolean;
    onMarkerPlace: (marker: MarkerPoint, sopInstanceUID: string) => void;
    onMarkerDelete: (marker: ReportMark) => void;
}

const offsetMap = {
    1: -10,
    2: -5,
};

const initialMenuState = {
    mouseX: null,
    mouseY: null,
};

const ImagePositionMarkerCanvas = forwardRef<CanvasHandle, Props>(
    (
        {
            src,
            imagePositionMarkers,
            containerWidth,
            containerHeight,
            canvasMarkers,
            disabled,
            onMarkerPlace,
            onMarkerDelete,
        },
        ref,
    ) => {
        const [activeMarker, setActiveMarker] = React.useState<ReportMark | undefined>(undefined);
        const [menuPos, setMenuPos] = React.useState<{
            mouseX: null | number;
            mouseY: null | number;
        }>(initialMenuState);

        const { stageRef, imageRef } = useKonva(ref);
        const { image, scale, canvasWidth, canvasHeight } = useImageScaleToFit(
            src,
            containerWidth,
            containerHeight,
        );

        const onDeleteMark = () => {
            if (!activeMarker) return;
            onMarkerDelete(activeMarker);
            closeContextMenu();
        };

        const onDropMarker = (e) => {
            e.preventDefault();
            if (!stageRef?.current) return;
            // register event position
            stageRef.current.setPointersPositions(e);
            const vector2d = stageRef.current.getPointerPosition();
            if (!vector2d) return;
            onMarkerPlace(
                {
                    PointX: vector2d.x / scale,
                    PointY: vector2d.y / scale,
                    PointInImageX: vector2d.x / scale,
                    PointInImageY: vector2d.y / scale,
                },
                e.dataTransfer.getData('sopInsUid'),
            );
        };

        const openContextMenu = (event: KonvaEventObject<PointerEvent>, marker: ReportMark) => {
            if (disabled) return;
            event.evt.stopPropagation();
            event.evt.preventDefault();
            setActiveMarker(marker);
            setMenuPos({
                mouseX: event.evt.clientX + 8,
                mouseY: event.evt.clientY + 8,
            });
        };

        const closeContextMenu = () => {
            setActiveMarker(undefined);
            setMenuPos(initialMenuState);
        };

        return (
            <div onDragOver={(e) => e.preventDefault()} onDrop={onDropMarker}>
                <Stage
                    className={classes.canvas}
                    x={0}
                    y={0}
                    ref={stageRef}
                    width={canvasWidth || 0}
                    height={canvasHeight || 0}
                    scale={{ x: scale, y: scale }}
                >
                    <Layer>
                        <Image ref={imageRef} image={image} />
                        {canvasMarkers.map((marker) => {
                            return (
                                <RenderMaker
                                    id={marker.id}
                                    key={marker.id}
                                    markerType={marker.type}
                                    attribute={marker.attribute}
                                    isSelected={false}
                                    onMarkerSelect={() => {}}
                                    onUpdateAttr={() => {}}
                                />
                            );
                        })}
                        {imagePositionMarkers.map((marker) => {
                            return (
                                <Group
                                    key={marker.SOPInstanceUID}
                                    offsetX={20}
                                    offsetY={20}
                                    onContextMenu={(e) => openContextMenu(e, marker)}
                                >
                                    <Rect
                                        x={marker.PointInImageX}
                                        y={marker.PointInImageY}
                                        fill="red"
                                        width={40}
                                        height={40}
                                        stroke="black"
                                        strokeWidth={2}
                                    />
                                    <Text
                                        x={marker.PointInImageX}
                                        y={marker.PointInImageY}
                                        text={marker.MappingNumber.toString()}
                                        fontSize={32}
                                        fill="white"
                                        offsetX={offsetMap[marker.MappingNumber.toString().length]}
                                        offsetY={-6}
                                    />
                                </Group>
                            );
                        })}
                    </Layer>
                </Stage>
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
    },
);

export default ImagePositionMarkerCanvas;
