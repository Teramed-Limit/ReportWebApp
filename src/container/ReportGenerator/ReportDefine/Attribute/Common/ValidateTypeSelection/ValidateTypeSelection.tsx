import React from 'react';

import BaseNativeSelection from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection';

interface Props {
    value: string;
    onValueChange: (val: string) => void;
}

const ValidateTypeSelection = ({ value = '', onValueChange }: Props) => {
    return (
        <BaseNativeSelection
            options={[
                {
                    label: 'None',
                    value: 'none',
                },
                {
                    label: 'Required',
                    value: 'required',
                },
            ]}
            value={value}
            onValueChange={onValueChange}
        />
    );
};

export default ValidateTypeSelection;
