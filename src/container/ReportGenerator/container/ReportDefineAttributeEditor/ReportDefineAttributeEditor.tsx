import React from 'react';

import { Stack } from '@mui/material';
import * as R from 'ramda';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import classes from './ReportDefineAttributeEditor.module.scss';
import {
    selectedAttribute,
    selectedAttributePath,
    selectedAttributeProps,
    selectedReportDefine,
} from '../../../../atom/report-generator';
import AttributeList from '../../../../components/AttributeList/AttributeList';

// const rowColumnSelectionComp = (name) => ({
//     name,
//     component: BaseNativeSelection,
//     props: {
//         options: [
//             { label: 'Column', value: 'column' },
//             { label: 'Row', value: 'row' },
//         ],
//     },
// });

const ReportDefineAttributeEditor = () => {
    const attributePath = useRecoilValue(selectedAttributePath);
    const setFormDefine = useSetRecoilState(selectedReportDefine);
    const [attribute, setAttribute] = useRecoilState(selectedAttribute);
    const attributeProps = useRecoilValue(selectedAttributeProps);

    const onSetAttribute = (
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        setAttribute((pre) => R.assocPath(attrPath, attrValue, pre));
        setFormDefine((pre) => R.assocPath([...attributePath, ...attrPath], attrValue, pre));
    };

    return (
        <Stack direction="column" className={classes.container}>
            <AttributeList
                attribute={attribute}
                setAttribute={onSetAttribute}
                attributeComponentMapper={attributeProps.attributeComponentMapper}
                attributeConstructorMapper={attributeProps.attributeConstructorMapper}
                showTitle={attributeProps.showTitle}
                title={attributeProps.title}
                filterType={attributeProps.filterType}
                includeAttribute={attributeProps.includeAttribute}
                excludeAttribute={attributeProps.excludeAttribute}
                // attributeComponentMapper={{
                //     orientation: [rowColumnSelectionComp('')],
                //     compositeOrientation: [rowColumnSelectionComp('')],
                //     type: [
                //         {
                //             name: '',
                //             component: FieldTypeSelection,
                //             props: { onValueChange: onSetAttribute },
                //         },
                //         {
                //             name: 'validate',
                //             component: ValidateSelection,
                //             props: { onValueChange: onSetAttribute },
                //         },
                //         {
                //             name: 'optionSource',
                //             component: BaseNativeSelection,
                //             props: { options: [{ label: 'Http', value: 'http' }] },
                //         },
                //     ],
                //     color: [
                //         {
                //             name: '',
                //             component: ColorPickerButton,
                //         },
                //     ],
                // }}
                // attributeConstructorMapper={{
                //     validate: new RequiredValidateAttribute(),
                //     labelStyle: new CSSStyle(),
                //     valueStyle: new CSSStyle(),
                // }}
            />
        </Stack>
    );
};

export default ReportDefineAttributeEditor;
