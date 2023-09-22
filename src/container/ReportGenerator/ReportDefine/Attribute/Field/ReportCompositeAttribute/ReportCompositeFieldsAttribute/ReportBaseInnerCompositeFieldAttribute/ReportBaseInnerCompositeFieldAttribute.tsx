import React from 'react';

import { InnerCompositeFieldAttribute } from './InnerCompositeFieldAttribute';
import AttributeList from '../../../../../../../../components/AttributeList/AttributeList';
import { FormFieldType } from '../../../../../../../Report/FieldComponent/field-type';
import ReportButtonBarAttribute from '../../../../Common/Complex/ReportButtonBarAttribute/ReportButtonBarAttribute';
import ReportCSSStyleAttribute from '../../../../Common/Complex/ReportCSSStyleAttribute/ReportCSSStyleAttribute';
import ReportValidateAttribute from '../../../../Common/Complex/ReportValidateAttribute/ReportValidateAttribute';
import FieldTypeSelection from '../../../../Common/FieldTypeSelection/FieldTypeSelection';
import OrientationSelection from '../../../../Common/OrientationSelection/OrientationSelection';
import PercentageNumber from '../../../../Common/PercentageNumber/PercentageNumber';
import { FieldAttributeMapper } from '../../../../report-define-attributes-mapper';

interface Props {
    attrPath: (number | string)[];
    attribute: InnerCompositeFieldAttribute;
    onSetAttribute: (attrPath: (number | string)[], attrValue: number | string | boolean) => void;
}

const ReportBaseInnerCompositeFieldAttribute = ({ attribute, onSetAttribute }: Props) => {
    return (
        <AttributeList
            title={attribute.id}
            defaultExpanded={false}
            attribute={new InnerCompositeFieldAttribute(attribute)}
            setAttribute={onSetAttribute}
            attributeComponentMapper={{
                orientation: OrientationSelection,
                type: () => (
                    <FieldTypeSelection
                        value={attribute.type}
                        exclude={[FormFieldType.Composite, FormFieldType.Array]}
                        onValueChange={(value) => {
                            const attributeInstance = FieldAttributeMapper[value](attribute);
                            onSetAttribute([], {
                                ...attributeInstance,
                                type: value,
                            });
                        }}
                    />
                ),
                width: PercentageNumber,
                validate: ReportValidateAttribute,
                valueStyle: ReportCSSStyleAttribute,
                buttonBar: ReportButtonBarAttribute,
            }}
        ></AttributeList>
    );
};

export default ReportBaseInnerCompositeFieldAttribute;
