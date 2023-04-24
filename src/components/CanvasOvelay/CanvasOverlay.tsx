import React from 'react';

import { IconButton } from '@mui/material';
import cx from 'classnames';
import Konva from 'konva';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { BiSelection } from 'react-icons/bi';
import { BsFillTrashFill } from 'react-icons/bs';
import { FiCopy } from 'react-icons/fi';

import classes from './CanvasOverlay.module.scss';
import { CanvasMarker } from '../../interface/canvas-maker-attribute';
import { reorder } from '../../utils/general';
import { NodeEnableMapper } from '../Canvas/Tools/marker-mapper';

interface Props {
    canvasMarkers: CanvasMarker<Konva.ShapeConfig>[];
    selectMarkerId: string;
    setCanvasMarkers: React.Dispatch<React.SetStateAction<CanvasMarker<Konva.ShapeConfig>[]>>;
    setSelectMarkerId: React.Dispatch<React.SetStateAction<string>>;
    deleteMarker: (markerId: string) => void;
    copyMarker: (markerId: string) => void;
}

const CanvasOverlay = ({
    canvasMarkers,
    selectMarkerId,
    setCanvasMarkers,
    setSelectMarkerId,
    deleteMarker,
    copyMarker,
}: Props) => {
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const quotes = reorder(canvasMarkers, result.source.index, result.destination.index);
        setCanvasMarkers(quotes);
    };

    return (
        <div className={classes.canvasMarkerList}>
            <div className={classes.title}>Overlay</div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                    {(provided) => (
                        <div
                            style={{ height: canvasMarkers.length === 0 ? '0px' : 'auto' }}
                            className={classes.itemContainer}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {canvasMarkers.map((marker, index) => {
                                return (
                                    <Draggable
                                        key={marker.id}
                                        draggableId={marker.id.toString()}
                                        index={index}
                                    >
                                        {(itemProvided) => (
                                            <>
                                                <div
                                                    className={cx(classes.item, {
                                                        [classes.selected]:
                                                            selectMarkerId === marker.id,
                                                    })}
                                                    ref={itemProvided.innerRef}
                                                    {...itemProvided.draggableProps}
                                                    {...itemProvided.dragHandleProps}
                                                >
                                                    {`${marker.name.replace(/_(.*)/g, '')}_${
                                                        index + 1
                                                    }`}
                                                    <div className={classes.buttonContainer}>
                                                        {NodeEnableMapper[marker.type] ? (
                                                            <>
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        setSelectMarkerId(
                                                                            marker.id,
                                                                        );
                                                                    }}
                                                                >
                                                                    <BiSelection />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    color="default"
                                                                    onClick={() => {
                                                                        copyMarker(marker.id);
                                                                    }}
                                                                >
                                                                    <FiCopy />
                                                                </IconButton>
                                                            </>
                                                        ) : null}

                                                        <IconButton
                                                            size="small"
                                                            color="secondary"
                                                            onClick={() => {
                                                                deleteMarker(marker.id);
                                                            }}
                                                        >
                                                            <BsFillTrashFill />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default CanvasOverlay;
