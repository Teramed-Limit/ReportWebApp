import React from 'react';

import BaseNativeSelection from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection';

interface Props {
    value: string;
    onValueChange: (val: number) => void;
}

const TextAlignSelection = ({ value = '', onValueChange }: Props) => {
    return (
        <BaseNativeSelection
            options={[
                { label: 'left', value: 'left' },
                { label: 'right', value: 'right' },
                { label: 'center', value: 'center' },
                { label: 'justify', value: 'justify' },
            ]}
            value={value}
            onValueChange={onValueChange}
        />
    );
};

export default TextAlignSelection;
