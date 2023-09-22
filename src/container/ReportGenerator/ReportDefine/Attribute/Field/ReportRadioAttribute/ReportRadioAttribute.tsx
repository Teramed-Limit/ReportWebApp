import React from 'react';

import { RadioFieldAttribute } from './RadioFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import ReportOptionSourceAttribute from '../../Common/Complex/ReportOptionSourceAttribute/ReportOptionSourceAttribute';
import OrientationSelection from '../../Common/OrientationSelection/OrientationSelection';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportRadioAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<RadioFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new RadioFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                attributeComponentMapper={{
                    optionSource: ReportOptionSourceAttribute,
                    direction: OrientationSelection,
                }}
                filterType={'include'}
                includeAttribute={['direction', 'optionSource', 'filterCondition']}
            />
        </>
    );
};

export default ReportRadioAttribute;
