import React from 'react';

import { ReportDiagramFieldAttribute } from './ReportDiagramFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportDiagramAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<ReportDiagramFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new ReportDiagramFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                filterType={'include'}
                includeAttribute={['width', 'height']}
            />
        </>
    );
};

export default ReportDiagramAttribute;
