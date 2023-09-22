import React from 'react';

import BaseNativeSelection from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection';

interface Props {
    value: string;
    onValueChange: (val: string) => void;
}

const OptionTypeSelection = ({ value = '', onValueChange }: Props) => {
    return (
        <BaseNativeSelection
            options={[
                {
                    label: 'http',
                    value: 'http',
                },
            ]}
            value={value}
            onValueChange={onValueChange}
        />
    );
};

export default OptionTypeSelection;
