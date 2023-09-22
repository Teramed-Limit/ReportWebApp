import React from 'react';

import { CodeListSelectionAttribute } from './CodeListSelectionAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import ReportOptionSourceAttribute from '../../Common/Complex/ReportOptionSourceAttribute/ReportOptionSourceAttribute';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportCodeListSelectionAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<CodeListSelectionAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new CodeListSelectionAttribute(attribute)}
                setAttribute={onSetAttribute}
                attributeComponentMapper={{ optionSource: ReportOptionSourceAttribute }}
                filterType={'include'}
                includeAttribute={[
                    'isMulti',
                    'fetchLatest',
                    'optionSource',
                    'filterCondition',
                    'joinStr',
                ]}
            />
        </>
    );
};

export default ReportCodeListSelectionAttribute;
