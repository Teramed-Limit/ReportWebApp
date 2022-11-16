import React, { ForwardedRef } from 'react';

import BaseTextArea from '../../../../components/UI/BaseTextArea/BaseTextArea';
import { TextareaField } from '../../../../interface/textarea-field';

interface Props {
    field: TextareaField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

const TextArea = React.forwardRef(
    ({ field, value, onValueChange, disabled }: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
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
            />
        );
    },
);

export default TextArea;
