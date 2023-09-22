import React from 'react';

import { CSSStyle } from './CSSStyle';
import AttributeList from '../../../../../../../components/AttributeList/AttributeList';
import ColorPickerButton from '../../../../../../../components/ColorPickerButton/ColorPickerButton';
import FontNameSelection from '../../FontNameSelection/FontNameSelection';
import FontStyleSelection from '../../FontStyleSelection/FontStyleSelection';
import FontWeightSelection from '../../FontWeightSelection/FontWeightSelection';
import TextAlignSelection from '../../TextAlignSelection/TextAlignSelection';
import TextDecorationSelection from '../../TextDecorationSelection/TextDecorationSelection';

interface Props {
    attribute: any;
    attrPath?: (string | number)[];
    setAttribute: (attrName: (string | number)[], attrValue: any) => void;
}

const ReportCSSStyleAttribute = ({ attrPath = [], attribute, setAttribute }: Props) => {
    return (
        <AttributeList
            attribute={new CSSStyle(attribute)}
            attrPath={attrPath}
            setAttribute={setAttribute}
            attributeComponentMapper={{
                color: ColorPickerButton,
                backgroundColor: ColorPickerButton,
                borderColor: ColorPickerButton,
                // borderStyle: BorderStyleSelection,
                fontFamily: FontNameSelection,
                fontStyle: FontStyleSelection,
                fontWeight: FontWeightSelection,
                textAlign: TextAlignSelection,
                textDecoration: TextDecorationSelection,
            }}
        />
    );
};

export default ReportCSSStyleAttribute;
