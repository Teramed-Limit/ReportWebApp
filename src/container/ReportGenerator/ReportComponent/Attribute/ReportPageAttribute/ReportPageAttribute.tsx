import React from 'react';

import AttributeList from '../../../../../components/AttributeList/AttributeList';
import { RepPage } from '../../../../../interface/report-generator/rep-page';
import { camelize } from '../../../../../utils/general';

interface Props {
    pageAttribute: RepPage;
    onSetPageAttribute: (
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => void;
}

const ReportPageAttribute = ({ pageAttribute, onSetPageAttribute }: Props) => {
    return (
        <>
            <AttributeList
                title={camelize(pageAttribute.name)}
                attribute={pageAttribute}
                setAttribute={onSetPageAttribute}
                filterType="exclude"
                excludeAttribute={['components', 'name', 'width']}
            />
        </>
    );
};

export default ReportPageAttribute;
