import React from 'react';

import { CurveChartAttribute } from './CurveChartAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportCurveChartAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<CurveChartAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new CurveChartAttribute(attribute)}
                setAttribute={onSetAttribute}
                filterType={'include'}
            />
        </>
    );
};

export default ReportCurveChartAttribute;
