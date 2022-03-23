import React from 'react';

import { Divider, List, ListItem, ListItemText } from '@mui/material';

import { ReportFindingItemList } from '../../../../../interface/report-finding';
import classes from './SectionContentListView.module.scss';

interface Props {
    activeIndex: number;
    findingItems: ReportFindingItemList[];
    onFindingItemClick: (value: string) => void;
}

const SectionContentListView = ({ activeIndex, findingItems, onFindingItemClick }: Props) => {
    return (
        <>
            <div className={classes.section}>Sections Content List</div>
            {activeIndex === -1 ? (
                <div className={classes.emptyList}>Please select a section</div>
            ) : (
                <List component="nav" className={classes.list}>
                    {findingItems.map((item) => (
                        <React.Fragment key={item.Content}>
                            <ListItem
                                button
                                className={classes.item}
                                onClick={() => onFindingItemClick(item.Content)}
                            >
                                <ListItemText primary={item.Content} />
                                {item.IsDefault === '1' ? (
                                    <span className={classes.default}>default</span>
                                ) : (
                                    ''
                                )}
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            )}
        </>
    );
};

export default SectionContentListView;
