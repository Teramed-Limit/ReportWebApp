import React from 'react';

import { ArrayFieldAttribute } from './ArrayFieldAttribute';
import ReportTemplateFieldAttribute from './ReportTemplateField/ReportTemplateFieldAttribute';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import OrientationSelection from '../../Common/OrientationSelection/OrientationSelection';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportArrayAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<ArrayFieldAttribute>) => {
    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new ArrayFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                attributeComponentMapper={{
                    arrayOrientation: OrientationSelection,
                    templateField: (
                        <ReportTemplateFieldAttribute
                            attrPath={[...attrPath, 'templateField']}
                            attribute={attribute.templateField}
                            setAttribute={onSetAttribute}
                        />
                    ),
                }}
                filterType={'include'}
                includeAttribute={['templateField', 'arrayOrientation']}
            />
        </>
    );
};

export default ReportArrayAttribute;
