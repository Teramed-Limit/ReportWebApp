import React from 'react';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import * as R from 'ramda';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import classes from './ReportDefineAttributeEditor.module.scss';
import {
    selectedAttributeAtom,
    selectedAttributePathAtom,
    selectedAttributeTypeAtom,
    selectedFieldsAtom,
    selectedReportDefine,
} from '../../../../../atom/report-generator';
import AttributeList from '../../../../../components/AttributeList/AttributeList';
import { useReportLayout } from '../../../../../hooks/useReportLayout';
import { FormFieldType, LayoutType } from '../../../../Report/FieldComponent/field-type';
import ReportCSSStyleAttribute from '../Common/Complex/ReportCSSStyleAttribute/ReportCSSStyleAttribute';
import ReportValidateAttribute from '../Common/Complex/ReportValidateAttribute/ReportValidateAttribute';
import OrientationSelection from '../Common/OrientationSelection/OrientationSelection';
import PercentageNumber from '../Common/PercentageNumber/PercentageNumber';
import { ArrayFieldAttribute } from '../Field/ReportArrayAttribute/ArrayFieldAttribute';
import { FieldAttribute } from '../Field/ReportBaseFieldAttribute/FieldAttribute';
import ReportBaseAttribute from '../Field/ReportBaseFieldAttribute/ReportBaseAttribute';
import { CompositeFieldAttribute } from '../Field/ReportCompositeAttribute/CompositeFieldAttribute';
import { ReportDefineAttributesMapper } from '../report-define-attributes-mapper';

export interface RenderComponentAttributeProps<T> {
    attrPath: (number | string)[];
    attribute: T;
    onSetAttribute: (attrPath: (number | string)[], attrValue: number | string | boolean) => void;
}

const ReportDefineAttributeEditor = () => {
    const attributePath = useRecoilValue(selectedAttributePathAtom);
    const attributeType = useRecoilValue(selectedAttributeTypeAtom);
    const [attribute, setAttribute] = useRecoilState(selectedAttributeAtom);
    const selectedFields = useRecoilValue(selectedFieldsAtom);
    const setFormDefine = useSetRecoilState(selectedReportDefine);
    const { moveEntity, copyEntity, deleteEntity } = useReportLayout(attributePath, 'Field');

    const onSetAttribute = (
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        setAttribute((pre) => R.assocPath(attrPath, attrValue, pre));
        setFormDefine((pre) => R.assocPath([...attributePath, ...attrPath], attrValue, pre));
    };

    // 定義渲染元件的函數
    const renderComponent = (
        type: string | undefined,
        props: RenderComponentAttributeProps<any>,
    ) => {
        if (!type) return null;

        const ComponentToRender = ReportDefineAttributesMapper[type];
        if (!ComponentToRender) return null;

        let renderAttribute: FieldAttribute | CompositeFieldAttribute | ArrayFieldAttribute =
            new FieldAttribute(attribute);
        if (ComponentToRender) {
            switch (type) {
                case LayoutType.Page:
                case LayoutType.Section:
                case LayoutType.SubSection:
                    return <ComponentToRender {...props} />;
                case FormFieldType.Composite:
                    renderAttribute = new CompositeFieldAttribute(attribute);
                    break;
                case FormFieldType.Array:
                    renderAttribute = new ArrayFieldAttribute(attribute);
                    break;
                default:
                    renderAttribute = new FieldAttribute(attribute);
                    break;
            }
        }
        return (
            <>
                <ReportBaseAttribute
                    attrPath={attributePath}
                    attribute={renderAttribute}
                    onSetAttribute={onSetAttribute}
                />
                <ComponentToRender {...props} />
                <Stack spacing="2px">
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ArrowUpwardIcon />}
                        onClick={() => moveEntity(-1)}
                    >
                        Move Forward
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ContentCopyIcon />}
                        onClick={copyEntity}
                    >
                        Copy
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={deleteEntity}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ArrowDownwardIcon />}
                        onClick={() => moveEntity(1)}
                    >
                        Move Backward
                    </Button>
                </Stack>
            </>
        );
    };

    const onSetMultipleFieldsAttribute = (
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        setAttribute((pre) => R.assocPath(attrPath, attrValue, pre));
        setFormDefine((pre) => {
            selectedFields.forEach((fieldPath) => {
                pre = R.assocPath([...JSON.parse(fieldPath), ...attrPath], attrValue, pre);
            });
            return pre;
        });
    };

    const renderCommonFieldAttribute = () => {
        return (
            <AttributeList
                title={attribute.id}
                defaultExpanded={false}
                attribute={attribute}
                setAttribute={onSetMultipleFieldsAttribute}
                attributeComponentMapper={{
                    orientation: OrientationSelection,
                    validate: ReportValidateAttribute,
                    labelWidth: PercentageNumber,
                    labelStyle: ReportCSSStyleAttribute,
                    valueStyle: ReportCSSStyleAttribute,
                }}
                filterType={'include'}
                includeAttribute={[
                    // 'type',
                    'orientation',
                    'hideLabel',
                    'readOnly',
                    'validate',
                    'labelWidth',
                    'labelStyle',
                    'valueStyle',
                ]}
            />
        );
    };

    return (
        <Stack direction="column" className={classes.container}>
            {selectedFields.size === 1
                ? renderComponent(attributeType, {
                      attrPath: attributePath,
                      attribute,
                      onSetAttribute,
                  })
                : renderCommonFieldAttribute()}
        </Stack>
    );
};

export default ReportDefineAttributeEditor;
