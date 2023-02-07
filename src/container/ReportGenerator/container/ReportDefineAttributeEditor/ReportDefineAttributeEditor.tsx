import React, { useRef, useState } from 'react';

import { Stack } from '@mui/material';
import * as R from 'ramda';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
    selectedAttribute,
    selectedAttributePath,
    selectedReportDefine,
} from '../../../../atom/report-generator';
import AttributeList from '../../../../components/AttributeList/AttributeList';
import ColorPickerButton from '../../../../components/ColorPickerButton/ColorPickerButton';
import BaseNativeSelection from '../../../../components/UI/BaseNativeSelection/BaseNativeSelection';
import FieldTypeSelection from '../../attribute/Component/FieldTypeSelection/FieldTypeSelection';
import ValidateSelection from '../../attribute/Component/ValidateSelection/ValidateSelection';
import { CSSStyle } from '../../attribute/style/CSSStyle';
import { RequiredValidateAttribute } from '../../attribute/validation/RequiredValidateAttribute';
import classes from './ReportDefineAttributeEditor.module.scss';

const rowColumnSelectionComp = (name) => ({
    name,
    component: BaseNativeSelection,
    props: {
        options: [
            { label: 'Column', value: 'column' },
            { label: 'Row', value: 'row' },
        ],
    },
});

const ReportDefineAttributeEditor = () => {
    const attributePath = useRecoilValue(selectedAttributePath);
    const setFormDefine = useSetRecoilState(selectedReportDefine);
    const [attribute, setAttribute] = useRecoilState(selectedAttribute);
    const [modalPosition, setModalPosition] = useState({
        left: 70,
        top: 25,
    });

    const canMoveRef = useRef(false);

    const onSetAttribute = (
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        setAttribute((pre) => R.assocPath(attrPath, attrValue, pre));
        setFormDefine((pre) => R.assocPath([...attributePath, ...attrPath], attrValue, pre));
    };

    return (
        <Stack
            direction="column"
            style={{ transform: `translate(${modalPosition.top}px,${modalPosition.left}px)` }}
            className={classes.container}
        >
            <div
                className={classes.moveable}
                onMouseDown={() => (canMoveRef.current = true)}
                onMouseUp={() => (canMoveRef.current = false)}
                onMouseLeave={() => (canMoveRef.current = false)}
                onMouseMove={(e) => {
                    if (!canMoveRef.current) return;
                    setModalPosition((prev) => ({
                        left: prev.left + e.movementY,
                        top: prev.top + e.movementX,
                    }));
                }}
            />
            <AttributeList
                attribute={attribute}
                attributeComponentMapper={{
                    orientation: [rowColumnSelectionComp('')],
                    compositeOrientation: [rowColumnSelectionComp('')],
                    type: [
                        {
                            name: '',
                            component: FieldTypeSelection,
                            props: { onValueChange: onSetAttribute },
                        },
                        {
                            name: 'validate',
                            component: ValidateSelection,
                            props: { onValueChange: onSetAttribute },
                        },
                        {
                            name: 'optionSource',
                            component: BaseNativeSelection,
                            props: { options: [{ label: 'Http', value: 'http' }] },
                        },
                    ],
                    color: [
                        {
                            name: '',
                            component: ColorPickerButton,
                        },
                    ],
                }}
                attributeConstructorMapper={{
                    validate: new RequiredValidateAttribute(),
                    labelStyle: new CSSStyle(),
                    valueStyle: new CSSStyle(),
                }}
                setAttribute={onSetAttribute}
            />
        </Stack>
    );
};

export default ReportDefineAttributeEditor;
