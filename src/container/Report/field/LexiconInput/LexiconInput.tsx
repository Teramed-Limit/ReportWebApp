import React from 'react';

import { observer } from 'mobx-react';

import BaseLexiconInput from '../../../../components/UI/BaseLexiconInput/BaseLexiconInput';
import { LexiconField } from '../../../../interface/lexicon-field';
import { useOptionStore } from '../../../../models/useStore';

interface Props {
    field: LexiconField<any>;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LexiconInput = React.forwardRef(({ field, value, onValueChange, disabled }: Props, ref) => {
    const store = useOptionStore();

    const { optionSource } = field;
    const { format = 'Name', key = 'Code', source } = optionSource;
    const options = store.getOptions(source) || [];

    return (
        <BaseLexiconInput
            id={field.id}
            disabled={disabled || field.readOnly}
            value={value}
            valueKey={format}
            optionKey={key}
            maxLength={field.maxLength}
            onValueChange={onValueChange}
            initialLexiconList={options}
            getOptionLabel={(option) => option[format]}
            showTooltip={false}
        />
    );
});

export default observer(LexiconInput);
