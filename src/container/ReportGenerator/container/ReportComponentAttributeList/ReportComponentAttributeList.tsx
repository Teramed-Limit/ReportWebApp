import React from 'react';

import AttributeList from '../../../../components/AttributeList/AttributeList';
import ColorPickerButton from '../../../../components/ColorPickerButton/ColorPickerButton';
import ExpandToggler from '../../../../components/ExpandToggler/ExpandToggler';
import BaseNativeSelection from '../../../../components/UI/BaseNativeSelection/BaseNativeSelection';
import { RepComponentAttribute } from '../../../../interface/report-generator/rep-attribute';

interface Props {
    compAttribute?: RepComponentAttribute;
    onSetCompAttribute: (
        uuid: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => void;
}

const ReportComponentAttributeList = ({ compAttribute = undefined, onSetCompAttribute }: Props) => {
    const setAttribute = (attrName: (string | number)[], attrValue: any) => {
        if (!compAttribute?.uuid) return;
        onSetCompAttribute(compAttribute.uuid, attrName, attrValue);
    };
    return (
        <>
            {/* Layout */}
            <ExpandToggler title="Layout">
                <AttributeList
                    showTitle={false}
                    attribute={{
                        x: compAttribute?.x,
                        y: compAttribute?.y,
                        width: compAttribute?.width,
                        height: compAttribute?.height,
                    }}
                    setAttribute={setAttribute}
                />
            </ExpandToggler>
            {/* Font */}
            <ExpandToggler title="Font">
                <AttributeList
                    showTitle={false}
                    attribute={{
                        fontColor: compAttribute?.fontColor,
                        fontSize: compAttribute?.fontSize,
                        fontName: compAttribute?.fontName,
                        fontWeight: compAttribute?.fontWeight,
                        fontStyle: compAttribute?.fontStyle,
                    }}
                    setAttribute={setAttribute}
                    attributeComponentMapper={{
                        fontColor: [
                            {
                                name: '',
                                component: ColorPickerButton,
                            },
                        ],
                        fontName: [
                            {
                                name: '',
                                component: BaseNativeSelection,
                                props: {
                                    options: [
                                        {
                                            label: 'Microsoft JhengHei',
                                            value: 'Microsoft JhengHei',
                                        },
                                        { label: 'Arial', value: 'Arial' },
                                    ],
                                },
                            },
                        ],
                        fontWeight: [
                            {
                                name: '',
                                component: BaseNativeSelection,
                                props: {
                                    options: [
                                        { label: 'Thin', value: 200 },
                                        { label: 'Normal', value: 400 },
                                        { label: 'Bold', value: 600 },
                                    ],
                                },
                            },
                        ],
                        fontStyle: [
                            {
                                name: '',
                                component: BaseNativeSelection,
                                props: {
                                    options: [{ label: 'Normal', value: 'normal' }],
                                },
                            },
                        ],
                    }}
                />
            </ExpandToggler>
            {/* Miscellaneous */}
            <ExpandToggler title="Miscellaneous">
                <AttributeList
                    showTitle={false}
                    attribute={{
                        prefix: compAttribute?.prefix,
                        suffix: compAttribute?.suffix,
                        value: compAttribute?.value,
                    }}
                    setAttribute={setAttribute}
                />
            </ExpandToggler>
        </>
    );
};
export default ReportComponentAttributeList;
