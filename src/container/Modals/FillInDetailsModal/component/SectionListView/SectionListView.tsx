import React, { useContext } from 'react';

import { IconButton } from '@material-ui/core';
import { FaRegEdit } from 'react-icons/all';

import BaseTextArea from '../../../../../components/UI/BaseTextArea/BaseTextArea';
import FormSectionField from '../../../../../layout/FormSectionField/FormSectionField';
import { FindingTemplateContext } from '../../context/finding-template-context';
import classes from './SectionListView.module.scss';

interface Props {
    onCategoryTextChange: (index: number, value: string) => void;
    onCategoryFocus: (index: number) => void;
}

const SectionListView = ({ onCategoryTextChange, onCategoryFocus }: Props) => {
    const { setEdit, findingList, setBackupFindingList } = useContext(FindingTemplateContext);

    const onEdit = () => {
        setBackupFindingList(findingList);
        setEdit(true);
    };
    return (
        <>
            <div className={classes.section}>
                Sections
                <IconButton onClick={onEdit}>
                    <FaRegEdit />
                </IconButton>
            </div>
            {findingList.map((field, index) => {
                return (
                    <div key={field.ItemName} className={classes.container}>
                        <FormSectionField
                            id={field.ItemName}
                            label={field.ItemName}
                            hint={
                                field.AutoFillDefaultWhenEmpty === '1'
                                    ? 'Auto fill default content'
                                    : ''
                            }
                            labelAlign="flex-start"
                            readOnly={false}
                            hasValidation={false}
                            isDirty={false}
                            isValid
                            errorMessage=""
                            disabled={false}
                            noBorder={false}
                            fieldComponent={
                                <BaseTextArea
                                    rows={1}
                                    value={field.Text}
                                    onValueChange={(value) => onCategoryTextChange(index, value)}
                                    onFocusChange={() => onCategoryFocus(index)}
                                />
                            }
                        />
                    </div>
                );
            })}
        </>
    );
};

export default React.memo(SectionListView);
