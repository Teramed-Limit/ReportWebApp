import React from 'react';

import { FilterConditionAttribute } from './FilterConditionAttribute';
import AttributeList from '../../../../../../../components/AttributeList/AttributeList';
import OptionSourceSelection from '../../OptionSourceSelection/OptionSourceSelection';
import OptionTypeSelection from '../../OptionTypeSelection/OptionTypeSelection';

interface Props {
    attribute: any;
    attrPath?: (string | number)[];
    setAttribute: (attrName: (string | number)[], attrValue: any) => void;
}

const ReportFilterConditionAttribute = ({ attrPath = [], attribute, setAttribute }: Props) => {
    return (
        <AttributeList
            attribute={new FilterConditionAttribute(attribute)}
            attrPath={attrPath}
            setAttribute={setAttribute}
            attributeComponentMapper={{
                type: OptionTypeSelection,
                source: OptionSourceSelection,
            }}
        />
    );
};

export default ReportFilterConditionAttribute;
