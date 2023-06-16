import React, { useCallback, useContext, useEffect, useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button as MaterialButton, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { AxiosError } from 'axios';
import * as R from 'ramda';
import { DropResult } from 'react-beautiful-dnd';
import { FaEdit } from 'react-icons/fa';
import { filter, finalize, first } from 'rxjs/operators';

import SectionContentListEdit from './component/SectionContentListEdit/SectionContentListEdit';
import SectionContentListView from './component/SectionContentListView/SectionContentListView';
import SectionListEdit from './component/SectionListEdit/SectionListEdit';
import SectionListView from './component/SectionListView/SectionListView';
import classes from './FillInDetailsModal.module.scss';
import ViewEditSwitcher from './ViewEditSwitcher/ViewEditSwitcher';
import {
    addFormFieldLexiconCategory,
    addFormFieldLexiconCategoryContent,
    deleteFormFieldLexiconCategory,
    deleteFormFieldLexiconCategoryContent,
    getFormFieldLexiconCategory,
    reorderFormFieldLexiconCategory,
} from '../../../axios/api';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { NotificationContext } from '../../../context/notification-context';
import {
    CategoryContents,
    FormFieldLexiconCategory,
    ReorderFormFieldLexiconCategoryBody,
} from '../../../interface/form-field-lexicon-category';
import { useReportDataStore } from '../../../models/useStore';
import { generateUUID, isEmptyOrNil, reorder } from '../../../utils/general';

interface Props {
    fieldId: string;
}

const FillInDetailsModal = ({ fieldId }: Props) => {
    const setModal = useContext(ModalContext);
    const { setErrorNotification } = useContext(NotificationContext);
    const { valueChanged, reportTemplate } = useReportDataStore();
    const [edit, setEdit] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [lexiconCategoryList, setLexiconCategoryList] = useState<FormFieldLexiconCategory[]>([]);

    // 查詢辭庫列表
    const queryFormFieldLexiconCategory = useCallback(() => {
        getFormFieldLexiconCategory(reportTemplate, fieldId)
            .pipe(
                first(),
                filter((res) => !isEmptyOrNil(res.data) && !isEmptyOrNil(reportTemplate)),
            )
            .subscribe((res) => {
                setActiveIndex(0);
                setLexiconCategoryList(res.data);
            });
    }, [fieldId, reportTemplate]);

    // 選取作用中的Category
    const onCategorySelect = useCallback(
        (id: number) => {
            setActiveIndex(id);
        },
        [setActiveIndex],
    );

    // 取消選取作用中的Category
    const onCancelSelectCategory = useCallback(() => {
        setActiveIndex(-1);
    }, [setActiveIndex]);

    const onClose = () => {
        setModal(null);
    };

    const onConfirmSelect = () => {
        let text = '';
        lexiconCategoryList.forEach((findingCategory) => {
            let section;
            if (isEmptyOrNil(findingCategory.Text)) {
                section = `${findingCategory.Text}`;
            } else {
                section = `${findingCategory.Text}\n`;
            }
            text += section;
        });
        valueChanged(fieldId, text);
        onClose();
    };

    // 排序Category
    const onReorderLexiconCategory = (result: DropResult) => {
        if (!result.destination) return;
        const reorderList = reorder<FormFieldLexiconCategory>(
            lexiconCategoryList,
            result.source.index,
            result.destination.index,
        );

        let orderIdx = 0;
        const body = reorderList.map((item) => {
            orderIdx++;
            return {
                Id: item.Id,
                DisplayIndex: orderIdx,
            } as ReorderFormFieldLexiconCategoryBody;
        });
        reorderFormFieldLexiconCategory(body).subscribe();
        setLexiconCategoryList(reorderList);
        onCancelSelectCategory();
    };

    // 刪除Category
    const onDeleteCategory = (deleteId: string, index: number) => {
        deleteFormFieldLexiconCategory(deleteId)
            .pipe(finalize(() => onCancelSelectCategory()))
            .subscribe({
                next: () => {
                    setLexiconCategoryList((pre) => R.dissocPath([index], pre));
                },
                error: (err: AxiosError<{ Message: string }>) => {
                    setErrorNotification(err.response?.data.Message || err.message);
                },
            });
    };

    // 新增Category
    const onAddCategory = (itemName: string) => {
        const newCategory: FormFieldLexiconCategory = {
            Id: generateUUID(),
            ReportTemplate: reportTemplate,
            FieldId: fieldId,
            ItemName: itemName,
            DisplayIndex: lexiconCategoryList.length,
            AutoFillDefaultWhenEmpty: false,
            CategoryContents: [],
            Text: '',
        };

        addFormFieldLexiconCategory(newCategory)
            .pipe(finalize(() => onCancelSelectCategory()))
            .subscribe({
                next: () => {
                    setLexiconCategoryList((sectionList) => R.append(newCategory, sectionList));
                },
                error: (err: AxiosError<{ Message: string }>) => {
                    setErrorNotification(err.response?.data.Message || err.message);
                },
            });
    };

    // 修改Category
    const onUpdateCategory = (updateIdx: number) => {
        const updateCategory = {
            ...lexiconCategoryList[updateIdx],
            AutoFillDefaultWhenEmpty: !lexiconCategoryList[updateIdx].AutoFillDefaultWhenEmpty,
        };

        addFormFieldLexiconCategory(updateCategory).subscribe({
            next: () => {
                setLexiconCategoryList((sectionList) =>
                    R.update(updateIdx, updateCategory, sectionList),
                );
            },
            error: (err: AxiosError<{ Message: string }>) => {
                setErrorNotification(err.response?.data.Message || err.message);
            },
        });
    };

    // 選擇Content並新增到cache text等待 onConfirm 加入
    const onCategoryContentClick = useCallback(
        (value: string) => {
            setLexiconCategoryList((list) => {
                return list.map((item, updateIdx) =>
                    updateIdx === activeIndex
                        ? { ...item, Text: `${item.Text}${value}, ` }
                        : { ...item },
                );
            });
        },
        [activeIndex, setLexiconCategoryList],
    );

    // Category欄位內容更新
    const onCategoryTextChange = (index: number, value: string) => {
        setLexiconCategoryList((list) => {
            return list.map((item, updateIdx) =>
                updateIdx === index ? { ...item, Text: value } : { ...item },
            );
        });
    };

    // 刪除Category Content
    const onDeleteCategoryContent = (deleteId: string, index: number) => {
        if (activeIndex === -1) {
            setErrorNotification('You do not select any category');
            return;
        }

        deleteFormFieldLexiconCategoryContent(deleteId).subscribe({
            next: () => {
                setLexiconCategoryList((pre) =>
                    R.dissocPath([activeIndex, 'CategoryContents', index], pre),
                );
            },
            error: (err: AxiosError<{ Message: string }>) => {
                setErrorNotification(err.response?.data.Message || err.message);
            },
        });
    };

    // 新增Category Content
    const onAddCategoryContent = (content: string) => {
        if (activeIndex === -1) {
            setErrorNotification('You do not select any category');
            return;
        }

        const newCategoryContent: CategoryContents = {
            ContentId: generateUUID(),
            Content: content,
            IsDefault: false,
            DisplayIndex: lexiconCategoryList[activeIndex].CategoryContents.length,
            ItemId: lexiconCategoryList[activeIndex].Id,
        };

        addFormFieldLexiconCategoryContent(newCategoryContent).subscribe({
            next: () => {
                setLexiconCategoryList((pre) => {
                    const mutate = R.append(newCategoryContent, pre[activeIndex].CategoryContents);
                    return R.assocPath([activeIndex, 'CategoryContents'], mutate, pre);
                });
            },
            error: (err: AxiosError<{ Message: string }>) => {
                setErrorNotification(err.response?.data.Message || err.message);
            },
        });
    };

    // 修改Category Content
    const onUpdateCategoryContent = (updateIdx: number, isDefault: boolean) => {
        if (activeIndex === -1) {
            setErrorNotification('You do not select any category');
            return;
        }

        const updateCategoryContentList = R.assocPath(
            [activeIndex, 'CategoryContents', updateIdx, 'IsDefault'],
            isDefault,
            lexiconCategoryList,
        ) as FormFieldLexiconCategory[];

        addFormFieldLexiconCategoryContent(
            R.path([activeIndex, 'CategoryContents', updateIdx], updateCategoryContentList),
        ).subscribe({
            next: () => {
                setLexiconCategoryList(updateCategoryContentList);
            },
            error: (err: AxiosError<{ Message: string }>) => {
                setErrorNotification(err.response?.data.Message || err.message);
            },
        });
    };

    useEffect(() => {
        queryFormFieldLexiconCategory();
    }, [queryFormFieldLexiconCategory]);

    const body = (
        <div className={classes.container}>
            <div className={[classes.body, classes.content].join(' ')}>
                <ViewEditSwitcher
                    isEditMode={edit}
                    titleComponent={
                        <Stack direction="row" alignItems="center">
                            <Typography variant="h6" component="div" sx={{ marginRight: '6px' }}>
                                Section Category
                            </Typography>
                            <ViewEditSwitcher
                                isEditMode={edit}
                                viewComponent={
                                    <MaterialButton
                                        variant="contained"
                                        color="warning"
                                        startIcon={<FaEdit size={18} />}
                                        onClick={() => setEdit(true)}
                                    >
                                        <Typography variant="subtitle2" component="div">
                                            Edit Mode
                                        </Typography>
                                    </MaterialButton>
                                }
                                editComponent={
                                    <MaterialButton
                                        variant="contained"
                                        color="success"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => setEdit(false)}
                                    >
                                        <Typography variant="subtitle2" component="div">
                                            View Mode
                                        </Typography>
                                    </MaterialButton>
                                }
                            />
                        </Stack>
                    }
                    editComponent={
                        <SectionListEdit
                            lexiconCategoryList={lexiconCategoryList}
                            activeIndex={activeIndex}
                            onAddCategory={onAddCategory}
                            onUpdateCategory={onUpdateCategory}
                            onDeleteCategory={onDeleteCategory}
                            onReorderLexiconCategory={onReorderLexiconCategory}
                            onCategorySelect={onCategorySelect}
                        />
                    }
                    viewComponent={
                        <SectionListView
                            lexiconCategoryList={lexiconCategoryList}
                            onCategoryTextChange={onCategoryTextChange}
                            onCategorySelect={onCategorySelect}
                        />
                    }
                />
            </div>

            <div className={[classes.body, classes.content].join(' ')}>
                <ViewEditSwitcher
                    isEditMode={edit}
                    titleComponent={
                        <Stack sx={{ minHeight: '32px' }} direction="row" alignItems="center">
                            <Typography variant="h6" component="div">
                                Section Contents
                            </Typography>
                        </Stack>
                    }
                    editComponent={
                        <SectionContentListEdit
                            activeIndex={activeIndex}
                            contentList={lexiconCategoryList?.[activeIndex]?.CategoryContents || []}
                            onAddCategoryContent={onAddCategoryContent}
                            onUpdateCategoryContent={onUpdateCategoryContent}
                            onDeleteCategoryContent={onDeleteCategoryContent}
                        />
                    }
                    viewComponent={
                        <SectionContentListView
                            activeIndex={activeIndex}
                            contentList={lexiconCategoryList?.[activeIndex]?.CategoryContents || []}
                            onCategoryContentClick={onCategoryContentClick}
                        />
                    }
                />
            </div>
        </div>
    );

    const footer = (
        <>
            <div className={[classes.footer, classes.content, classes.right].join(' ')}>
                <Button disabled={edit} theme="primary" onClick={onConfirmSelect}>
                    Confirm
                </Button>
                <Button disabled={edit} theme="reversePrimary" onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </>
    );

    return (
        <Modal
            open
            height="90%"
            width="90%"
            headerTitle="Endoscopy Reporting System"
            body={body}
            footer={footer}
        />
    );
};

export default FillInDetailsModal;
