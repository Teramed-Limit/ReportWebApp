import React from 'react';

import * as R from 'ramda';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
    selectedAttribute,
    selectedAttributePath,
    selectedReportDefine,
} from '../../../../../atom/report-generator';
import classes from '../../../../../components/UI/BaseNativeSelection/BaseNativeSelection.module.scss';
import { FieldAttributeMapper } from '../../field/field-attribute-mapper';

interface Props {
    id?: string;
    disabled?: boolean;
    value: string;
    currentPath: (string | number)[];
}
const FieldTypeSelection = ({ id, disabled = false, value = '', currentPath }: Props) => {
    const attributePath = useRecoilValue(selectedAttributePath);
    const [attribute, setSelectedAttribute] = useRecoilState(selectedAttribute);
    const setFormDefine = useSetRecoilState(selectedReportDefine);

    const onSetAttributePath = (e) => {
        e.stopPropagation();
        const attributeInstance = FieldAttributeMapper[e.target.value](
            R.path(currentPath, attribute),
        );

        setSelectedAttribute((pre) => R.assocPath(currentPath, attributeInstance, pre));
        setFormDefine((pre) =>
            R.assocPath([...attributePath, ...currentPath], attributeInstance, pre),
        );
    };

    return (
        <div className={classes.container}>
            <select
                id={id}
                disabled={disabled}
                className={classes[`text-input`]}
                value={value}
                onChange={(event) => onSetAttributePath(event)}
            >
                {Object.keys(FieldAttributeMapper).map((k) => (
                    <option key={k} value={k}>
                        {k}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FieldTypeSelection;
