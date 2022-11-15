import React, { useCallback, useContext, useEffect, useState } from 'react';

import * as R from 'ramda';
import { filter, first } from 'rxjs/operators';

import { getReportFindings } from '../../../axios/api';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { ReportFindingItemList } from '../../../interface/report-finding';
import { useReportDataStore } from '../../../models/useStore';
import { isEmptyOrNil } from '../../../utils/general';
import SectionContentListEdit from './component/SectionContentListEdit/SectionContentListEdit';
import SectionContentListView from './component/SectionContentListView/SectionContentListView';
import SectionListEdit from './component/SectionListEdit/SectionListEdit';
import SectionListView from './component/SectionListView/SectionListView';
import { FindingTemplateContext } from './context/finding-template-context';
import classes from './FillInDetailsModal.module.scss';
import ViewEditSwitcher from './ViewEditSwitcher/ViewEditSwitcher';

interface Props {
    fieldId: string;
}

const FillInDetailsModal = ({ fieldId }: Props) => {
    const { valueChanged, ersType } = useReportDataStore();
    const setModal = useContext(ModalContext);
    const { findingList, setFindingList, activeIndex, setActiveIndex } =
        useContext(FindingTemplateContext);

    const [itemList, setItemList] = useState<ReportFindingItemList[]>([]);

    useEffect(() => {
        getReportFindings(ersType, fieldId)
            .pipe(
                first(),
                filter((res) => !isEmptyOrNil(res.data) && !isEmptyOrNil(ersType)),
            )
            .subscribe((res) => {
                const dataList = res.data;
                setFindingList(dataList);
                setActiveIndex(0);
                setItemList(dataList[0].ReportFindingsItemList);
            });
    }, [ersType, fieldId, setActiveIndex, setFindingList]);

    const onClose = () => {
        setModal(null);
    };

    const onConfirmSelect = () => {
        let findings = '';
        findingList.forEach((findingCategory) => {
            let section;
            if (isEmptyOrNil(findingCategory.Text)) {
                section = `${findingCategory.Text}`;
            } else {
                section = `${findingCategory.Text}\n`;
            }
            findings += section;
        });
        valueChanged(fieldId, findings);
        onClose();
    };

    const onCategoryTextChange = (index: number, value: string) => {
        setFindingList((list) => {
            return list.map((item, updateIdx) =>
                updateIdx === index ? { ...item, Text: value } : { ...item },
            );
        });
    };

    const onCancelFocus = useCallback(() => {
        setActiveIndex(-1);
        setItemList([]);
    }, [setActiveIndex]);

    const onCategoryFocus = useCallback(
        (id: number) => {
            setActiveIndex(id);
            setItemList(findingList[id].ReportFindingsItemList);
        },
        [findingList, setActiveIndex],
    );

    const onFindingItemClick = useCallback(
        (value: string) => {
            setFindingList((list) => {
                return list.map((item, updateIdx) =>
                    updateIdx === activeIndex
                        ? { ...item, Text: `${item.Text}${value}, ` }
                        : { ...item },
                );
            });
        },
        [activeIndex, setFindingList],
    );

    const updateFindingItems = useCallback(
        (updateIdx: number, mutateFindingItems: ReportFindingItemList[]) => {
            setFindingList((list) => {
                return list.map((item, index) =>
                    updateIdx === index
                        ? { ...item, ReportFindingsItemList: mutateFindingItems }
                        : { ...item },
                );
            });
        },
        [setFindingList],
    );

    const updateIsDefaultOnItemList = useCallback(
        (setDefaultIdx: number) => {
            setFindingList((list) => {
                const mutateItems = list[activeIndex].ReportFindingsItemList.map((item, idx) => ({
                    ...item,
                    IsDefault: setDefaultIdx === idx ? '1' : '0',
                }));
                setItemList(mutateItems);
                return R.assocPath([activeIndex, 'ReportFindingsItemList'], mutateItems, list);
            });
        },
        [activeIndex, setFindingList],
    );

    const body = (
        <div className={classes.container}>
            <div className={[classes.body, classes.content].join(' ')}>
                <ViewEditSwitcher
                    editComponent={
                        <SectionListEdit
                            ersType={ersType}
                            fieldId={fieldId}
                            onCategoryFocus={onCategoryFocus}
                            onCancelFocus={onCancelFocus}
                        />
                    }
                    viewComponent={
                        <SectionListView
                            onCategoryTextChange={onCategoryTextChange}
                            onCategoryFocus={onCategoryFocus}
                        />
                    }
                />
            </div>

            <div className={[classes.body, classes.content].join(' ')}>
                <ViewEditSwitcher
                    editComponent={
                        <SectionContentListEdit
                            activeIndex={activeIndex}
                            findingItems={itemList}
                            updateFindingItems={updateFindingItems}
                            updateIsDefaultOnItemList={updateIsDefaultOnItemList}
                        />
                    }
                    viewComponent={
                        <SectionContentListView
                            activeIndex={activeIndex}
                            findingItems={itemList}
                            onFindingItemClick={onFindingItemClick}
                        />
                    }
                />
            </div>
        </div>
    );

    const footer = (
        <>
            <div className={[classes.footer, classes.content, classes.left].join(' ')}>
                Current ERS Type: {ersType}, Field: {fieldId}
            </div>
            <div className={[classes.footer, classes.content, classes.right].join(' ')}>
                <Button theme="primary" onClick={onConfirmSelect}>
                    Confirm
                </Button>
                <Button theme="reversePrimary" onClick={onClose}>
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
