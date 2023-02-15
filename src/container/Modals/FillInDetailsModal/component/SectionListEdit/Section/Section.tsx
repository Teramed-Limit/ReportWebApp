import React from 'react';

import { Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import { RiDeleteBin6Fill, RiDragMove2Line } from 'react-icons/ri';

import classes from './Section.module.scss';

interface Props {
    index: number;
    id: string;
    itemName: string;
    active: boolean;
    autoFillDefaultWhenEmpty: boolean;
    toggleAutoFill: (index: number) => void;
    onDelete: (str: string) => void;
    onCancelSelectCategory?: () => void;
    onCategorySelect: (index: number) => void;
}

const getItemStyle = (active, isDragging, draggableStyle) => {
    return {
        userSelect: 'none',
        background: isDragging ? '#babfc7' : '',
        border: active ? '1px solid red' : '',
        ...draggableStyle,
    };
};

const Section = ({
    index,
    id,
    itemName,
    autoFillDefaultWhenEmpty,
    toggleAutoFill,
    onDelete,
    onCategorySelect,
    active,
}: Props) => {
    return (
        <>
            <Draggable draggableId={id} index={index}>
                {(provided, snapshot) => (
                    <div
                        className={classes.item}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            active,
                            snapshot.isDragging,
                            provided.draggableProps.style,
                        )}
                        onClick={(event) => {
                            event.stopPropagation();
                            onCategorySelect(index);
                        }}
                    >
                        <div>
                            <RiDragMove2Line className={classes.iconDrag} />
                            {itemName}
                        </div>
                        <div>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={autoFillDefaultWhenEmpty}
                                        onChange={() => toggleAutoFill(index)}
                                        color="primary"
                                    />
                                }
                                label="auto fill"
                            />
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDelete(itemName);
                                }}
                            >
                                <RiDeleteBin6Fill />
                            </IconButton>
                        </div>
                    </div>
                )}
            </Draggable>
        </>
    );
};

export default React.memo(Section);
