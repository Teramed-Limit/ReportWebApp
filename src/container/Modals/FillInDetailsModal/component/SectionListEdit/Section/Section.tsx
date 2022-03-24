import React from 'react';

import { Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import { RiDeleteBin6Fill, RiDragMove2Line } from 'react-icons/all';

import classes from './Section.module.scss';

interface Props {
    index: number;
    itemName: string;
    active: boolean;
    autoFillDefaultWhenEmpty: string;
    toggleAutoFill: (index: number) => void;
    onDelete: (str: string) => void;
    onCancelFocus?: () => void;
    onCategoryFocus: (index: number) => void;
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
    itemName,
    autoFillDefaultWhenEmpty,
    toggleAutoFill,
    onDelete,
    onCancelFocus = () => {},
    onCategoryFocus,
    active,
}: Props) => {
    return (
        <>
            <Draggable draggableId={itemName} index={index}>
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
                            onCategoryFocus(index);
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
                                        checked={autoFillDefaultWhenEmpty === '1'}
                                        onChange={() => toggleAutoFill(index)}
                                        color="primary"
                                    />
                                }
                                label="auto fill"
                            />
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onCancelFocus();
                                    onDelete(itemName);
                                }}
                                size="large"
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
