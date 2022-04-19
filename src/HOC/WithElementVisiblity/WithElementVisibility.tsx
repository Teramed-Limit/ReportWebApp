import React from 'react';

import { useRoleFunctionAvailable } from '../../hooks/useRoleFunctionAvailable';

interface Props {
    wrappedComp: JSX.Element;
}

const WithElementVisibility = ({ wrappedComp }: Props) => {
    const { checkAvailable } = useRoleFunctionAvailable();

    const withVisibility = () => {
        if (!wrappedComp.props?.id) {
            console.warn(`${wrappedComp} does not assign id.`);
            return wrappedComp;
        }
        const isAvailable = checkAvailable(wrappedComp.props?.id);
        return !isAvailable ? <div style={{ display: 'none' }}>{wrappedComp}</div> : wrappedComp;
    };

    return <>{withVisibility()}</>;
};

export default WithElementVisibility;
