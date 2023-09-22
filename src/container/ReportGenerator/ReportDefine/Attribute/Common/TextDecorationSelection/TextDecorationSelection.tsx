import React from 'react';

import BaseNativeSelection from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection';

interface Props {
    value: string;
    onValueChange: (val: string) => void;
}

const TextDecorationSelection = ({ value = '', onValueChange }: Props) => {
    return (
        <BaseNativeSelection
            options={[
                {
                    label: 'None',
                    value: 'none',
                },
                {
                    label: 'Line-Through',
                    value: 'line-through',
                },

                {
                    label: 'Underline',
                    value: 'underline',
                },
                {
                    label: 'Underline & Line-Through',
                    value: 'underline line-through',
                },
            ]}
            value={value}
            onValueChange={onValueChange}
        />
    );
};

export default TextDecorationSelection;
