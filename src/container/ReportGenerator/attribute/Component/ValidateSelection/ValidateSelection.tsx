import React from 'react';

import * as R from 'ramda';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
    selectedAttribute,
    selectedAttributePath,
    selectedReportDefine,
} from '../../../../../atom/report-generator';
import classes from '../../../../../components/UI/BaseNativeSelection/BaseNativeSelection.module.scss';
import { ValidateAttributeMapper } from '../../validation/validate-mapper';

interface Props {
    id?: string;
    disabled?: boolean;
    value: string;
}
const ValidateSelection = ({ id, disabled = false, value = '' }: Props) => {
    const attributePath = useRecoilValue(selectedAttributePath);
    const setSelectedAttribute = useSetRecoilState(selectedAttribute);
    const setFormDefine = useSetRecoilState(selectedReportDefine);

    const onSetAttributePath = (e) => {
        e.stopPropagation();
        const attributeInstance = ValidateAttributeMapper[e.target.value]();
        setSelectedAttribute((pre) => R.assocPath(['validate'], attributeInstance, pre));
        setFormDefine((pre) => R.assocPath([...attributePath, 'validate'], attributeInstance, pre));
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
                {Object.keys(ValidateAttributeMapper).map((k) => (
                    <option key={k} value={k}>
                        {k}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ValidateSelection;
