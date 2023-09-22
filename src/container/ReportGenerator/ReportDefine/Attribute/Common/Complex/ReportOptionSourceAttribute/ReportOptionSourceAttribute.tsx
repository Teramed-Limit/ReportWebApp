import React from 'react';

import { OptionSourceAttribute } from './OptionSourceAttribute';
import AttributeList from '../../../../../../../components/AttributeList/AttributeList';
import OptionSourceSelection from '../../OptionSourceSelection/OptionSourceSelection';
import OptionTypeSelection from '../../OptionTypeSelection/OptionTypeSelection';

interface Props {
    attribute: any;
    attrPath?: (string | number)[];
    setAttribute: (attrName: (string | number)[], attrValue: any) => void;
}

const ReportOptionSourceAttribute = ({ attrPath = [], attribute, setAttribute }: Props) => {
    return (
        <AttributeList
            attribute={new OptionSourceAttribute(attribute)}
            attrPath={attrPath}
            setAttribute={setAttribute}
            attributeComponentMapper={{
                type: OptionTypeSelection,
                source: OptionSourceSelection,
            }}
        />
    );
};

export default ReportOptionSourceAttribute;
