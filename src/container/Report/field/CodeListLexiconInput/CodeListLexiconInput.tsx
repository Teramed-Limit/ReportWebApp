import React from 'react';

import { observer } from 'mobx-react';

import BaseLexiconInput from '../../../../components/UI/BaseLexiconInput/BaseLexiconInput';
import { CodeList } from '../../../../interface/code-list';
import { LexiconField } from '../../../../interface/lexicon-field';
import { useOptionStore } from '../../../../models/useStore';

interface Props {
    field: LexiconField<any>;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CodeListLexiconInput = React.forwardRef(
    ({ field, value, onValueChange, disabled }: Props, ref) => {
        const store = useOptionStore();

        const { optionSource, filterCondition } = field;
        const { source } = optionSource;
        const options = store.getCodeList(source, filterCondition) || [];

        return (
            <BaseLexiconInput
                id={field.id}
                disabled={disabled || field.readOnly}
                value={value}
                valueKey="Value"
                optionKey="Id"
                maxLength={field.maxLength}
                onValueChange={onValueChange}
                initialLexiconList={options}
                getOptionLabel={(option: CodeList) => option.Value}
                showTooltip={false}
            />
        );
    },
);

export default observer(CodeListLexiconInput);
