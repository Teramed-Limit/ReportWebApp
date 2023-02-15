import React from 'react';

import {
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { RiDeleteBin6Fill } from 'react-icons/ri';

import { CategoryContents } from '../../../../../interface/form-field-lexicon-category';
import SectionAdder from '../SectionAdder/SectionAdder';
import classes from './SectionContentListEdit.module.scss';

interface Props {
    activeIndex: number;
    contentList: CategoryContents[];
    onAddCategoryContent: (categoryContent: string) => void;
    onUpdateCategoryContent: (updateIdx: number, isDefault: boolean) => void;
    onDeleteCategoryContent: (deleteId: string, index: number) => void;
}

const SectionContentListEdit = ({
    activeIndex,
    contentList,
    onAddCategoryContent,
    onUpdateCategoryContent,
    onDeleteCategoryContent,
}: Props) => {
    return (
        <>
            {activeIndex === -1 ? (
                <div className={classes.emptyList}>Please select a section</div>
            ) : (
                <List component="nav" className={classes.list}>
                    <>
                        {contentList.map((item, index) => (
                            <React.Fragment key={item.ContentId}>
                                <ListItem>
                                    <ListItemText primary={item.Content} />
                                    <div>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={item.IsDefault}
                                                    onChange={(e) =>
                                                        onUpdateCategoryContent(
                                                            index,
                                                            e.target.checked,
                                                        )
                                                    }
                                                    color="primary"
                                                />
                                            }
                                            label="default"
                                        />
                                        <IconButton
                                            onClick={() =>
                                                onDeleteCategoryContent(item.ContentId, index)
                                            }
                                        >
                                            <RiDeleteBin6Fill />
                                        </IconButton>
                                    </div>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                        <SectionAdder
                            itemNameList={contentList.map((item) => item.Content)}
                            isDragging={false}
                            onAddSection={onAddCategoryContent}
                        />
                    </>
                </List>
            )}
        </>
    );
};

export default SectionContentListEdit;
