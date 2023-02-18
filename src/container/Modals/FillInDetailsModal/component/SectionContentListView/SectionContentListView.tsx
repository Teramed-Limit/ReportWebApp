import React from 'react';

import { Divider, List, ListItem, ListItemText } from '@mui/material';

import { CategoryContents } from '../../../../../interface/form-field-lexicon-category';
import classes from './SectionContentListView.module.scss';

interface Props {
    activeIndex: number;
    contentList: CategoryContents[];
    onCategoryContentClick: (value: string) => void;
}

const SectionContentListView = ({ activeIndex, contentList, onCategoryContentClick }: Props) => {
    return (
        <>
            {activeIndex === -1 ? (
                <div className={classes.emptyList}>Please select a section</div>
            ) : (
                <List component="nav" className={classes.list}>
                    {contentList.map((item) => (
                        <React.Fragment key={item.Content}>
                            <ListItem
                                button
                                className={classes.item}
                                onClick={() => onCategoryContentClick(item.Content)}
                            >
                                <ListItemText primary={item.Content} />
                                {item.IsDefault && <span className={classes.default}>default</span>}
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
