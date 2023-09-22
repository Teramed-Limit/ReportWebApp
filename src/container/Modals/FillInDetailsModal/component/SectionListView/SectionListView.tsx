import React from 'react';

import { Stack } from '@mui/material';

import classes from './SectionListView.module.scss';
import BaseTextArea from '../../../../../components/UI/BaseTextArea/BaseTextArea';
import { FormFieldLexiconCategory } from '../../../../../interface/form-field-lexicon-category';
import InputField from '../../../../Report/Layout/InputField/InputField';
import InputFieldLabel from '../../../../Report/Layout/InputFieldLabel/InputFieldLabel';

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
                        <InputFieldLabel
                            id={field.ItemName}
                            labelStyle={{
                                width: '35%',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                alignItems: 'flex-start',
                            }}
                            label={field.ItemName}
                            hint={field.AutoFillDefaultWhenEmpty ? 'Auto fill default content' : ''}
                            hideLabelSection={false}
                            hasValidation={false}
                        />
                        {/* Value */}
                        <InputField
                            id={field.ItemName}
                            readOnly={false}
                            valueStyle={{ width: '65%', fontSize: '24px' }}
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
