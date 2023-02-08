import React, { ForwardedRef } from 'react';

import BaseTextArea from '../../../../components/UI/BaseTextArea/BaseTextArea';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { TextareaField } from '../../../../interface/textarea-field';

interface Props {
    field: TextareaField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

const TextArea = React.forwardRef(
    ({ field, value, onValueChange, disabled }: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
        const [, setSelectionText] = useLocalStorage<string>('textareaSelectionText', '');
        const onSelectString = (selectTxt: string) => setSelectionText(selectTxt);

        return (
            <BaseTextArea
                ref={ref}
                id={field.id}
                rows={field.rows || 4}
                placeholder={field.placeholder || ''}
                disabled={disabled || field.readOnly}
                value={value}
                maxLength={field.maxLength}
                onValueChange={onValueChange}
                onSelectString={onSelectString}
            />
        );
    },
);

export default TextArea;
