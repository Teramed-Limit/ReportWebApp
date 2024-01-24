import React from 'react';

import { SRTextFieldAttribute } from './SRTextFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportSRTextAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<SRTextFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new SRTextFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                filterType={'include'}
                includeAttribute={[
                    'structureReportPath',
                    'suffix',
                    'prefix',
                    'placeholder',
                    'daysToWeeks',
                    'formula',
                ]}
            />
        </>
    );
};

export default ReportSRTextAttribute;
