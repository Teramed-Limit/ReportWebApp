import React from 'react';

import BaseNativeSelection from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection';

interface Props {
    value: string;
    onValueChange: (val: string) => void;
}

const FontStyleSelection = ({ value = '', onValueChange }: Props) => {
    return (
        <BaseNativeSelection
            options={[
                {
                    label: 'Normal',
                    value: 'normal',
                },
            ]}
            value={value}
            onValueChange={onValueChange}
        />
    );
};

export default FontStyleSelection;
