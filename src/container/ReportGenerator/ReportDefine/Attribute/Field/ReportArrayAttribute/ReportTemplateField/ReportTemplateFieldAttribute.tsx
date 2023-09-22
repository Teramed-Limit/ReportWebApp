import React from 'react';

import AttributeList from '../../../../../../../components/AttributeList/AttributeList';
import { CompositeField } from '../../../../../../../interface/report-field/composite-field';
import { Field } from '../../../../../../../interface/report-field/field';
import { FormFieldType } from '../../../../../../Report/FieldComponent/field-type';
import ReportCSSStyleAttribute from '../../../Common/Complex/ReportCSSStyleAttribute/ReportCSSStyleAttribute';
import ReportValidateAttribute from '../../../Common/Complex/ReportValidateAttribute/ReportValidateAttribute';
import FieldTypeSelection from '../../../Common/FieldTypeSelection/FieldTypeSelection';
import OrientationSelection from '../../../Common/OrientationSelection/OrientationSelection';
import PercentageNumber from '../../../Common/PercentageNumber/PercentageNumber';
import {
    FieldAttributeMapper,
    ReportDefineAttributesMapper,
} from '../../../report-define-attributes-mapper';
import { FieldAttribute } from '../../ReportBaseFieldAttribute/FieldAttribute';
import { CompositeFieldAttribute } from '../../ReportCompositeAttribute/CompositeFieldAttribute';

interface Props {
    attrPath: (number | string)[];
    attribute: Field | CompositeField;
    setAttribute: (attrPath: (number | string)[], attrValue: number | string | boolean) => void;
}

const ReportTemplateFieldAttribute = ({ attrPath, attribute, setAttribute }: Props) => {
    const renderComponent = () => {
        if (!attribute.type) return null;

        const ComponentToRender = ReportDefineAttributesMapper[attribute.type];
        if (!ComponentToRender) return null;

        let renderAttribute;
        if (ComponentToRender) {
            switch (attribute.type) {
                case FormFieldType.Composite:
                    renderAttribute = new CompositeFieldAttribute(
                        attribute as CompositeFieldAttribute,
                    );
                    break;
                default:
                    renderAttribute = new FieldAttribute(attribute as FieldAttribute);
                    break;
            }
        }
        return (
            <>
                <AttributeList
                    title={attribute.id}
                    defaultExpanded={false}
                    attribute={renderAttribute}
                    setAttribute={(
                        attributePath: (number | string)[],
                        attributeValue: number | string | boolean,
                    ) => {
                        setAttribute(['templateField', ...attributePath], attributeValue);
                    }}
                    attributeComponentMapper={{
                        orientation: OrientationSelection,
                        validate: ReportValidateAttribute,
                        labelStyle: ReportCSSStyleAttribute,
                        labelWidth: PercentageNumber,
                        valueStyle: ReportCSSStyleAttribute,
                        type: (
                            <FieldTypeSelection
                                value={attribute.type}
                                exclude={[FormFieldType.Array]}
                                onValueChange={(value) => {
                                    const attributeInstance =
                                        FieldAttributeMapper[value](attribute);
                                    setAttribute(['templateField'], {
                                        ...attributeInstance,
                                        type: value,
                                    });
                                }}
                            />
                        ),
                    }}
                    filterType={'include'}
                    includeAttribute={[
                        'id',
                        'label',
                        'labelWidth',
                        'type',
                        'validate',
                        'hint',
                        'hideLabel',
                        'valueStyle',
                        'labelStyle',
                    ]}
                ></AttributeList>
                <ComponentToRender
                    attrPath={attrPath}
                    attribute={attribute}
                    onSetAttribute={(
                        attributePath: (number | string)[],
                        attributeValue: number | string | boolean,
                    ) => {
                        setAttribute(['templateField', ...attributePath], attributeValue);
                    }}
                />
            </>
        );
    };

    return <>{renderComponent()}</>;
};

export default ReportTemplateFieldAttribute;
