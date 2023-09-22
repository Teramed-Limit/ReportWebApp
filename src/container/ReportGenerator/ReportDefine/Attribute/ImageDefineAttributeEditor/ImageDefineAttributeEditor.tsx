import React from 'react';

import { Stack } from '@mui/material';
import * as R from 'ramda';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
    selectedAttributeAtom,
    selectedAttributePathAtom,
    selectedAttributeTypeAtom,
    selectedReportImageDefine,
} from '../../../../../atom/report-generator';
import { FieldAttribute } from '../Field/ReportBaseFieldAttribute/FieldAttribute';
import ReportBaseAttribute from '../Field/ReportBaseFieldAttribute/ReportBaseAttribute';
import { ReportDefineAttributesMapper } from '../report-define-attributes-mapper';
import classes from '../ReportDefineAttributeEditor/ReportDefineAttributeEditor.module.scss';

export interface RenderComponentAttributeProps<T> {
    attrPath: (number | string)[];
    attribute: T;
    onSetAttribute: (attrPath: (number | string)[], attrValue: number | string | boolean) => void;
}

const ImageDefineAttributeEditor = () => {
    const attributePath = useRecoilValue(selectedAttributePathAtom);
    const attributeType = useRecoilValue(selectedAttributeTypeAtom);
    const [attribute, setAttribute] = useRecoilState(selectedAttributeAtom);
    const setImageDefine = useSetRecoilState(selectedReportImageDefine);

    const onSetAttribute = (
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        setAttribute((pre) => R.assocPath(attrPath, attrValue, pre));
        setImageDefine((pre) => {
            return R.assocPath([...attributePath, ...attrPath], attrValue, pre);
        });
    };

    // 定義渲染元件的函數
    const renderComponent = (
        type: string | undefined,
        props: RenderComponentAttributeProps<any>,
    ) => {
        if (!type) return null;

        const ComponentToRender = ReportDefineAttributesMapper[type];
        if (!ComponentToRender) return null;
        const renderAttribute: FieldAttribute = new FieldAttribute(attribute);
        return (
            <>
                <ReportBaseAttribute
                    attrPath={attributePath}
                    attribute={renderAttribute}
                    onSetAttribute={onSetAttribute}
                />
                <ComponentToRender {...props} />
            </>
        );
    };

    return (
        <Stack direction="column" className={classes.container}>
            {renderComponent(attributeType, {
                attrPath: attributePath,
                attribute,
                onSetAttribute,
            })}
        </Stack>
    );
};

export default ImageDefineAttributeEditor;
