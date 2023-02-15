import React from 'react';

import { Stack } from '@mui/material';

import BaseTextArea from '../../../../../components/UI/BaseTextArea/BaseTextArea';
import { FormFieldLexiconCategory } from '../../../../../interface/form-field-lexicon-category';
import FormSectionField from '../../../../../layout/FormSectionField/FormSectionField';
import FormSectionFieldLabel from '../../../../Report/layout-container/FormSectionFieldLabel/FormSectionFieldLabel';
import classes from './SectionListView.module.scss';

interface Props {
    lexiconCategoryList: FormFieldLexiconCategory[];
    onCategoryTextChange: (index: number, value: string) => void;
    onCategorySelect: (index: number) => void;
}

const SectionListView = ({
    lexiconCategoryList,
    onCategoryTextChange,
    onCategorySelect,
}: Props) => {
    return (
        <Stack direction="column" sx={{ height: '100%' }} spacing={1}>
            {lexiconCategoryList.map((field, index) => {
                return (
                    <div key={field.Id} className={classes.container}>
                        {/* Label */}
                        <FormSectionFieldLabel
                            id={field.ItemName}
                            label={field.ItemName}
                            orientation="row"
                            hint={field.AutoFillDefaultWhenEmpty ? 'Auto fill default content' : ''}
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
                                    onFocusChange={() => onCategorySelect(index)}
                                />
                            }
                        />
                    </div>
                );
            })}
        </Stack>
    );
};

export default React.memo(SectionListView);
