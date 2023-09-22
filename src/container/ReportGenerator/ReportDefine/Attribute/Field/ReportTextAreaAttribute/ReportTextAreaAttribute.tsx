import React from 'react';

import { TextAreaFieldAttribute } from './TextAreaFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportTextAreaAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<TextAreaFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new TextAreaFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                filterType={'include'}
                includeAttribute={['rows', 'placeholder', 'maxLength']}
            />
        </>
    );
};

export default ReportTextAreaAttribute;
