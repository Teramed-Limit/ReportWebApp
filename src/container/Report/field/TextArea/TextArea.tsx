import React, { ForwardedRef } from 'react';

import BaseTextArea from '../../../../components/UI/BaseTextArea/BaseTextArea';
import { Field } from '../../../../interface/field';

interface Props {
    field: Field;
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
                disabled={disabled || field.readOnly}
                value={value}
                maxLength={field.maxLength}
                onValueChange={onValueChange}
            />
        );
    },
);

export default TextArea;
