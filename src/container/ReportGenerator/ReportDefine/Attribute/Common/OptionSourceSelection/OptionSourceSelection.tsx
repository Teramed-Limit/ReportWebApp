import React, { useEffect, useState } from 'react';

import { fetchCodeList } from '../../../../../../axios/api';
import BaseNativeSelection from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection';

interface Props {
    value: string;
    onValueChange: (val: string) => void;
}

const OptionSourceSelection = ({ value = '', onValueChange }: Props) => {
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const subscription = fetchCodeList().subscribe((res) => {
            const optionKeys: { label: string; value: string }[] = [];
            Object.keys(res.data).forEach((key) => {
                optionKeys.push({ label: key, value: key });
            });
            setOptions(optionKeys);
        });

        return () => subscription.unsubscribe();
    }, []);

    return <BaseNativeSelection options={options} value={value} onValueChange={onValueChange} />;
};

export default OptionSourceSelection;
