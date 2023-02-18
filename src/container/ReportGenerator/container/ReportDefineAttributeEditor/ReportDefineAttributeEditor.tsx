import React from 'react';

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
import { useChildModalMove } from '../../../../hooks/useModalMove/useChildModalMove';
import { ModalMoveEvent } from '../../../../hooks/useModalMove/useParentModalMove';
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
    id: string;
    onModalReadyToMove: (id: string) => void;
}

const ReportDefineAttributeEditor = React.forwardRef<ModalMoveEvent, Props>(
    ({ id, onModalReadyToMove }: Props, ref) => {
        const attributePath = useRecoilValue(selectedAttributePath);
        const setFormDefine = useSetRecoilState(selectedReportDefine);
        const [attribute, setAttribute] = useRecoilState(selectedAttribute);
        const { modalPosition, moveElementRef, onMouseDown, onMouseUp } = useChildModalMove(ref, {
            left: 0,
            top: 0,
        });

        const onSetAttribute = (
            attrPath: (number | string)[],
            attrValue: number | string | boolean,
        ) => {
            setAttribute((pre) => R.assocPath(attrPath, attrValue, pre));
            setFormDefine((pre) => R.assocPath([...attributePath, ...attrPath], attrValue, pre));
        };

        return (
            <Stack
                ref={moveElementRef}
                direction="column"
                style={{
                    position: 'absolute',
                    left: `${modalPosition.left}px`,
                    top: `${modalPosition.top}px`,
                }}
                className={classes.container}
            >
                <div
                    className={classes.moveable}
                    onMouseDown={(e) => {
                        onMouseDown(e);
                        onModalReadyToMove(id);
                    }}
                    onMouseUp={(e) => {
                        onMouseUp(e);
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
    },
);

export default ReportDefineAttributeEditor;
