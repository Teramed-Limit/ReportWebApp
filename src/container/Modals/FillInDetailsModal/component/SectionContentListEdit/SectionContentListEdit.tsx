import React, { useCallback, useEffect, useState } from 'react';

import {
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import * as R from 'ramda';
import { RiDeleteBin6Fill } from 'react-icons/all';

import { ReportFindingItemList } from '../../../../../interface/report-finding';
import SectionAdder from '../SectionAdder/SectionAdder';
import classes from './SectionContentListEdit.module.scss';

interface Props {
    activeIndex: number;
    findingItems: ReportFindingItemList[];
    updateFindingItems: (index: number, findingItems: ReportFindingItemList[]) => void;
    updateIsDefaultOnItemList: (setDefaultIdx: number) => void;
}

const SectionContentListEdit = ({
    activeIndex,
    findingItems: findingItemsProp,
    updateFindingItems,
    updateIsDefaultOnItemList,
}: Props) => {
    const [findingItems, setFindingItems] = useState(findingItemsProp);

    useEffect(() => {
        setFindingItems(findingItemsProp);
    }, [findingItemsProp]);

    const onDelete = useCallback(
        (content: string) => {
            setFindingItems((items) => {
                const updateItems = items.filter((item) => item.Content !== content);
                updateFindingItems(activeIndex, updateItems);
                return updateItems;
            });
        },
        [activeIndex, updateFindingItems],
    );

    const onAddContent = useCallback(
        (content: string) => {
            setFindingItems((items) => {
                const insertSection: ReportFindingItemList = {
                    Content: content,
                    IsDefault: '0',
                };
                const updateItems = R.append(insertSection, items);
                updateFindingItems(activeIndex, updateItems);
                return updateItems;
            });
        },
        [activeIndex, updateFindingItems],
    );

    return (
        <>
            <div className={classes.section}>Sections Content List</div>
            {activeIndex === -1 ? (
                <div className={classes.emptyList}>Please select a section</div>
            ) : (
                <List component="nav" className={classes.list}>
                    <>
                        {findingItems.map((item, index) => (
                            <React.Fragment key={item.Content}>
                                <ListItem>
                                    <ListItemText primary={item.Content} />
                                    <div>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={item.IsDefault === '1'}
                                                    onChange={() =>
                                                        updateIsDefaultOnItemList(index)
                                                    }
                                                    color="primary"
                                                />
                                            }
                                            label="default"
                                        />
                                        <IconButton
                                            onClick={() => onDelete(item.Content)}
                                            size="large"
                                        >
                                            <RiDeleteBin6Fill />
                                        </IconButton>
                                    </div>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                        <SectionAdder
                            itemNameList={findingItems.map((item) => item.Content)}
                            isDragging={false}
                            onAddSection={onAddContent}
                        />
                    </>
                </List>
            )}
        </>
    );
};

export default SectionContentListEdit;
