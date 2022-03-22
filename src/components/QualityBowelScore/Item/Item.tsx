import React from 'react';

interface Props {
    comp?: JSX.Element;
    children?: string;
}

const Item = ({ comp, children }: Props) => {
    return (
        <div>
            {comp}
            {children}
        </div>
    );
};

export default React.memo(Item);
