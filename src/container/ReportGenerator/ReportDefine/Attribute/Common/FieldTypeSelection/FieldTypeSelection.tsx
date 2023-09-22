import React from 'react';

import classes from '../../../../../../components/UI/BaseNativeSelection/BaseNativeSelection.module.scss';
import { FieldAttributeMapper } from '../../report-define-attributes-mapper';

interface Props {
    value: string;
    onValueChange: (val: string) => void;
    exclude?: string[];
}

const FieldTypeSelection = ({ value = '', exclude, onValueChange }: Props) => {
    const onSetAttributePath = (e) => {
        e.stopPropagation();
        onValueChange(e.target.value);
    };

    return (
        <div className={classes.container}>
            <select
                className={classes[`text-input`]}
                value={value}
                onChange={(event) => onSetAttributePath(event)}
            >
                {Object.keys(FieldAttributeMapper)
                    .filter((k) => !exclude?.includes(k))
                    .map((k) => (
                        <option key={k} value={k}>
                            {k}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default FieldTypeSelection;
