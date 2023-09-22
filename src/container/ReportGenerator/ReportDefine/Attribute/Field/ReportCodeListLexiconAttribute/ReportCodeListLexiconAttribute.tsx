import React from 'react';

import { CodeListLexiconAttribute } from './CodeListLexiconAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import ReportOptionSourceAttribute from '../../Common/Complex/ReportOptionSourceAttribute/ReportOptionSourceAttribute';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportCodeListLexiconAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<CodeListLexiconAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new CodeListLexiconAttribute(attribute)}
                setAttribute={onSetAttribute}
                attributeComponentMapper={{ optionSource: ReportOptionSourceAttribute }}
                filterType={'include'}
                includeAttribute={['maxLength', 'optionSource', 'filterCondition']}
            />
        </>
    );
};

export default ReportCodeListLexiconAttribute;
