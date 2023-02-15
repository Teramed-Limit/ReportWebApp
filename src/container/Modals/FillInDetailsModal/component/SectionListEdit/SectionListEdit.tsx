import React from 'react';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { FormFieldLexiconCategory } from '../../../../../interface/form-field-lexicon-category';
import SectionAdder from '../SectionAdder/SectionAdder';
import Section from './Section/Section';
import classes from './SectionListEdit.module.scss';

interface Props {
    lexiconCategoryList: FormFieldLexiconCategory[];
    activeIndex: number;
    onAddCategory: (category: string) => void;
    onUpdateCategory: (updateIdx: number) => void;
    onDeleteCategory: (deleteId: string, index: number) => void;
    onReorderLexiconCategory: (result: DropResult) => void;
    onCategorySelect: (index: number) => void;
}

const SectionListEdit = ({
    activeIndex,
    lexiconCategoryList,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
    onReorderLexiconCategory,
    onCategorySelect,
}: Props) => {
    return (
        <>
            <DragDropContext onDragEnd={onReorderLexiconCategory}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            className={classes.list}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {lexiconCategoryList.map((item, index) => (
                                <Section
                                    key={item.Id}
                                    id={item.Id}
                                    index={index}
                                    active={index === activeIndex}
                                    itemName={item.ItemName}
                                    autoFillDefaultWhenEmpty={item.AutoFillDefaultWhenEmpty}
                                    toggleAutoFill={onUpdateCategory}
                                    onDelete={() => onDeleteCategory(item.Id, index)}
                                    onCategorySelect={onCategorySelect}
                                />
                            ))}
                            <SectionAdder
                                itemNameList={lexiconCategoryList.map((item) => item.ItemName)}
                                isDragging={snapshot.isDraggingOver}
                                onAddSection={onAddCategory}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};

export default SectionListEdit;
