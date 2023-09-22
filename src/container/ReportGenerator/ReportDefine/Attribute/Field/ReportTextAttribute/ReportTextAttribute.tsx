import React from 'react';

import { TextFieldAttribute } from './TextFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportTextAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<TextFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new TextFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                filterType={'include'}
                includeAttribute={['suffix', 'prefix', 'placeholder']}
            />
        </>
    );
};

export default ReportTextAttribute;
