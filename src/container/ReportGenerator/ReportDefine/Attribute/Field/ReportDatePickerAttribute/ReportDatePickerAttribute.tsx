import React from 'react';

import { DatePickerFieldAttribute } from './DatePickerFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportDatePickerAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<DatePickerFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new DatePickerFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                filterType={'include'}
                includeAttribute={['defaultToday', 'fromFormat', 'toFormat']}
            />
        </>
    );
};

export default ReportDatePickerAttribute;
