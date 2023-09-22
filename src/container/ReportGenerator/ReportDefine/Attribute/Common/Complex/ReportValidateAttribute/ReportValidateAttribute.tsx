import React from 'react';

import { ValidateAttribute } from './ValidateAttribute';
import AttributeList from '../../../../../../../components/AttributeList/AttributeList';
import ValidateTypeSelection from '../../ValidateTypeSelection/ValidateTypeSelection';

interface Props {
    attribute: any;
    attrPath?: (string | number)[];
    setAttribute: (attrName: (string | number)[], attrValue: any) => void;
}

const ReportValidateAttribute = ({ attrPath = [], attribute, setAttribute }: Props) => {
    return (
        <AttributeList
            attrPath={attrPath}
            attribute={new ValidateAttribute(attribute)}
            setAttribute={setAttribute}
            attributeComponentMapper={{
                type: ValidateTypeSelection,
            }}
        />
    );
};

export default ReportValidateAttribute;
