import React from 'react';

import { useSetRecoilState } from 'recoil';

import { FieldAttribute } from './FieldAttribute';
import { selectedAttributeTypeAtom } from '../../../../../../atom/report-generator';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import ReportButtonBarAttribute from '../../Common/Complex/ReportButtonBarAttribute/ReportButtonBarAttribute';
import ReportCSSStyleAttribute from '../../Common/Complex/ReportCSSStyleAttribute/ReportCSSStyleAttribute';
import ReportValidateAttribute from '../../Common/Complex/ReportValidateAttribute/ReportValidateAttribute';
import FieldTypeSelection from '../../Common/FieldTypeSelection/FieldTypeSelection';
import OrientationSelection from '../../Common/OrientationSelection/OrientationSelection';
import PercentageNumber from '../../Common/PercentageNumber/PercentageNumber';
import { FieldAttributeMapper } from '../../report-define-attributes-mapper';
import { ArrayFieldAttribute } from '../ReportArrayAttribute/ArrayFieldAttribute';
import { CompositeFieldAttribute } from '../ReportCompositeAttribute/CompositeFieldAttribute';

interface Props {
    title?: string;
    attrPath: (number | string)[];
    attribute: FieldAttribute | CompositeFieldAttribute | ArrayFieldAttribute;
    onSetAttribute: (attrPath: (number | string)[], attrValue: number | string | boolean) => void;
    children?: React.ReactNode;
}

const ReportBaseAttribute = ({ attribute, onSetAttribute, children }: Props) => {
    const setAttributeType = useSetRecoilState(selectedAttributeTypeAtom);

    return (
        <>
            <AttributeList
                title={attribute.id}
                defaultExpanded={false}
                attribute={attribute}
                setAttribute={onSetAttribute}
                attributeComponentMapper={{
                    orientation: OrientationSelection,
                    type: () => (
                        <FieldTypeSelection
                            value={attribute.type}
                            onValueChange={(value) => {
                                const attributeInstance = FieldAttributeMapper[value](attribute);
                                onSetAttribute([], { ...attributeInstance, type: value });
                                setAttributeType(value);
                            }}
                        />
                    ),
                    validate: ReportValidateAttribute,
                    labelWidth: PercentageNumber,
                    labelStyle: ReportCSSStyleAttribute,
                    valueStyle: ReportCSSStyleAttribute,
                    buttonBar: ReportButtonBarAttribute,
                }}
                filterType={'exclude'}
                excludeAttribute={[
                    'fromModal',
                    'compositeOrientation',
                    'fields',
                    'templateField',
                    'arrayOrientation',
                ]}
            />
            {children}
        </>
    );
};

export default ReportBaseAttribute;
