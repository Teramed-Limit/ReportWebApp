import React from 'react';

import BaseNativeSelection from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection';

interface Props {
    value: string;
    onValueChange: (val: string) => void;
}

const OrientationSelection = ({ value = '', onValueChange }: Props) => {
    return (
        <BaseNativeSelection
            options={[
                { label: 'Row', value: 'row' },
                { label: 'Column', value: 'column' },
            ]}
            value={value}
            onValueChange={onValueChange}
        />
    );
};

export default OrientationSelection;
