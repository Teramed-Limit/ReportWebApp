import React from 'react';

import { TimePickerFieldAttribute } from './TimePickerFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportTimePickerAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<TimePickerFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new TimePickerFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                filterType={'include'}
                includeAttribute={['defaultNow']}
            />
        </>
    );
};

export default ReportTimePickerAttribute;
