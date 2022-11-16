import React, { useCallback, useContext } from 'react';

import { IconButton } from '@mui/material';
import { AxiosError } from 'axios';
import * as R from 'ramda';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FaCheck, MdCancel } from 'react-icons/all';
import { finalize, first } from 'rxjs/operators';

import { saveReportFindings } from '../../../../../axios/api';
import { NotificationContext } from '../../../../../context/notification-context';
import { ReportFinding } from '../../../../../interface/report-finding';
import { reorder } from '../../../../../utils/general';
import { FindingTemplateContext } from '../../context/finding-template-context';
import SectionAdder from '../SectionAdder/SectionAdder';
import Section from './Section/Section';
import classes from './SectionListEdit.module.scss';

interface Props {
    ersType: string;
    fieldId: string;
    onCategoryFocus: (index: number) => void;
    onCancelFocus: () => void;
}

const SectionListEdit = ({ ersType, fieldId, onCategoryFocus, onCancelFocus }: Props) => {
    const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
    const { setEdit, findingList, setFindingList, activeIndex, backupFindingList } =
        useContext(FindingTemplateContext);

    const onConfirm = useCallback(() => {
        saveReportFindings(ersType, fieldId, findingList)
            .pipe(
                first(),
                finalize(() => {
                    setEdit(false);
                    onCancelFocus();
                }),
            )
            .subscribe(
                (res) => {
                    setFindingList(res.data);
                    setSuccessNotification('Editing success');
                },
                (error: AxiosError) => {
                    setFindingList(backupFindingList);
                    setErrorNotification(error.response?.data.Message || 'Error occurs');
                },
            );
    }, [
        backupFindingList,
        ersType,
        fieldId,
        findingList,
        onCancelFocus,
        setEdit,
        setErrorNotification,
        setFindingList,
        setSuccessNotification,
    ]);

    const onCancel = useCallback(() => {
        setEdit(false);
        setFindingList(backupFindingList);
    }, [backupFindingList, setEdit, setFindingList]);

    const onDelete = useCallback(
        (itemName: string) => {
            setFindingList((sectionList) =>
                sectionList.filter((item) => item.ItemName !== itemName),
            );
        },
        [setFindingList],
    );

    const toggleAutoFill = useCallback(
        (updateIdx: number) => {
            setFindingList((sectionList) => {
                const updateSection = {
                    ...sectionList[updateIdx],
                    AutoFillDefaultWhenEmpty:
                        sectionList[updateIdx].AutoFillDefaultWhenEmpty === '1' ? '0' : '1',
                };
                return R.update(updateIdx, updateSection, sectionList);
            });
        },
        [setFindingList],
    );

    const onAddSection = useCallback(
        (sectionName: string) => {
            setFindingList((sectionList) => {
                const insertSection: ReportFinding = {
                    ERSType: ersType,
                    FieldId: fieldId,
                    ItemName: sectionName,
                    DisplayIndex: sectionList.length,
                    AutoFillDefaultWhenEmpty: '0',
                    ReportFindingsItemList: [],
                    Text: '',
                };
                return R.append(insertSection, sectionList);
            });
            onCancelFocus();
        },
        [ersType, fieldId, onCancelFocus, setFindingList],
    );

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        setFindingList(
            reorder<ReportFinding>(findingList, result.source.index, result.destination.index),
        );
        onCancelFocus();
    };

    return (
        <>
            <div className={classes.section}>
                Sections
                <IconButton onClick={onConfirm}>
                    <FaCheck className={classes.iconCheck} />
                </IconButton>
                <IconButton onClick={onCancel}>
                    <MdCancel className={classes.iconCancel} />
                </IconButton>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            className={classes.list}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {findingList.map((item, index) => (
                                <Section
                                    key={item.ItemName}
                                    index={index}
                                    active={index === activeIndex}
                                    itemName={item.ItemName}
                                    autoFillDefaultWhenEmpty={item.AutoFillDefaultWhenEmpty}
                                    toggleAutoFill={toggleAutoFill}
                                    onDelete={onDelete}
                                    onCancelFocus={onCancelFocus}
                                    onCategoryFocus={onCategoryFocus}
                                />
                            ))}
                            <SectionAdder
                                itemNameList={findingList.map((item) => item.ItemName)}
                                isDragging={snapshot.isDraggingOver}
                                onAddSection={onAddSection}
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
