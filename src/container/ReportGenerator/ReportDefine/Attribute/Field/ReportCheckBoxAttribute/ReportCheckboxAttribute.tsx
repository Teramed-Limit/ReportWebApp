import React from 'react';

import { CheckBoxFieldAttribute } from './CheckBoxFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import ReportOptionSourceAttribute from '../../Common/Complex/ReportOptionSourceAttribute/ReportOptionSourceAttribute';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportCheckboxAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<CheckBoxFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new CheckBoxFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                attributeComponentMapper={{ optionSource: ReportOptionSourceAttribute }}
                filterType={'include'}
                includeAttribute={['checkboxLabel']}
            />
        </>
    );
};

export default ReportCheckboxAttribute;
