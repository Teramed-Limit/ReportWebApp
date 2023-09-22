import React from 'react';

import BaseNativeSelection from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection';

interface Props {
    value: string;
    onValueChange: (val: string) => void;
}

const BorderStyleSelection = ({ value = '', onValueChange }: Props) => {
    return (
        <BaseNativeSelection
            options={[
                {
                    label: 'none',
                    value: 'none',
                },
                {
                    label: 'dashed',
                    value: 'dashed',
                },
                {
                    label: 'dotted',
                    value: 'dotted',
                },
                {
                    label: 'solid',
                    value: 'solid',
                },
            ]}
            value={value}
            onValueChange={onValueChange}
        />
    );
};

export default BorderStyleSelection;
