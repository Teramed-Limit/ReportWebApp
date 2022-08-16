import React, { useContext } from 'react';

import { FindingTemplateContext } from '../context/finding-template-context';

interface Props {
    viewComponent: JSX.Element;
    editComponent: JSX.Element;
}

const ViewEditSwitcher = ({ viewComponent, editComponent }: Props) => {
    const { edit } = useContext(FindingTemplateContext);
    return <>{edit ? editComponent : viewComponent}</>;
};

export default ViewEditSwitcher;
