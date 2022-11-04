import React, { useContext } from 'react';

import { IconButton } from '@mui/material';
import { FaRegEdit } from 'react-icons/all';

import BaseTextArea from '../../../../../components/UI/BaseTextArea/BaseTextArea';
import FormSectionField from '../../../../../layout/FormSectionField/FormSectionField';
import FormSectionFieldLabel from '../../../../Report/layout-container/FormSectionFieldLabel/FormSectionFieldLabel';
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
                        {/* Label */}
                        <FormSectionFieldLabel
                            id={field.ItemName}
                            label={field.ItemName}
                            orientation="row"
                            hint={
                                field.AutoFillDefaultWhenEmpty === '1'
                                    ? 'Auto fill default content'
                                    : ''
                            }
                            hideLabelSection={false}
                            hasValidation={false}
                        />
                        {/* Value */}
                        <FormSectionField
                            id={field.ItemName}
                            orientation="row"
                            readOnly={false}
                            isDirty={false}
                            isValid
                            errorMessage=""
                            disabled={false}
                            noBorder={false}
                            fieldComponent={
                                <BaseTextArea
                                    rows={1}
                                    style={{ height: '100%', overflow: 'auto' }}
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
