import React from 'react';

import { FieldsAttribute } from './FieldsAttribute';
import AttributeList from '../../../../../../../components/AttributeList/AttributeList';
import { Field } from '../../../../../../../interface/report-field/field';
import OptionTypeSelection from '../../OptionTypeSelection/OptionTypeSelection';

interface Props {
    attribute: Field[];
    attrPath?: (string | number)[];
    setAttribute: (attrName: (string | number)[], attrValue: any) => void;
}

const ReportFieldsAttribute = ({ attrPath = [], attribute, setAttribute }: Props) => {
    return (
        <AttributeList
            attribute={new FieldsAttribute(attribute)}
            attrPath={attrPath}
            setAttribute={setAttribute}
            attributeComponentMapper={{
                fields: OptionTypeSelection,
            }}
        />
    );
};

export default ReportFieldsAttribute;
