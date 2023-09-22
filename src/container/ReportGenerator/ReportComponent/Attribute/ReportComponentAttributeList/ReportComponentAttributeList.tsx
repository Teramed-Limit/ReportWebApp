import React from 'react';

import AttributeList from '../../../../../components/AttributeList/AttributeList';
import ColorPickerButton from '../../../../../components/ColorPickerButton/ColorPickerButton';
import ExpandToggler from '../../../../../components/ExpandToggler/ExpandToggler';
import { RepComponentAttribute } from '../../../../../interface/report-generator/rep-attribute';
import FontNameSelection from '../../../ReportDefine/Attribute/Common/FontNameSelection/FontNameSelection';
import FontStyleSelection from '../../../ReportDefine/Attribute/Common/FontStyleSelection/FontStyleSelection';
import FontWeightSelection from '../../../ReportDefine/Attribute/Common/FontWeightSelection/FontWeightSelection';

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
                    attribute={{
                        fontColor: compAttribute?.fontColor,
                        fontSize: compAttribute?.fontSize,
                        fontName: compAttribute?.fontName,
                        fontWeight: compAttribute?.fontWeight,
                        fontStyle: compAttribute?.fontStyle,
                        prefix: compAttribute?.prefix,
                        suffix: compAttribute?.suffix,
                    }}
                    setAttribute={setAttribute}
                    attributeComponentMapper={{
                        fontColor: ColorPickerButton,
                        fontName: FontNameSelection,
                        fontWeight: FontWeightSelection,
                        fontStyle: FontStyleSelection,
                    }}
                />
            </ExpandToggler>
            {/* Miscellaneous */}
            <ExpandToggler title="Miscellaneous">
                <AttributeList
                    attribute={{
                        value: compAttribute?.value,
                        src: compAttribute?.src,
                    }}
                    setAttribute={setAttribute}
                />
            </ExpandToggler>
            {/* Others */}
            <ExpandToggler title="Others">
                <AttributeList
                    attribute={{
                        showTotalPages: compAttribute?.showTotalPages,
                    }}
                    setAttribute={setAttribute}
                />
            </ExpandToggler>
            {/* Canvas */}
            <ExpandToggler title="Canvas">
                <AttributeList
                    attribute={{
                        x1: compAttribute?.x1,
                        x2: compAttribute?.x2,
                        y1: compAttribute?.y1,
                        y2: compAttribute?.y2,
                        color: compAttribute?.color,
                        thickness: compAttribute?.thickness,
                    }}
                    attributeComponentMapper={{ color: ColorPickerButton }}
                    setAttribute={setAttribute}
                />
            </ExpandToggler>
        </>
    );
};
export default ReportComponentAttributeList;
