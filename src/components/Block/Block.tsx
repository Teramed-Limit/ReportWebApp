import React from 'react';

import classes from './Block.module.scss';

interface Props {
    children?: React.ReactNode;
    enableScroll?: boolean;
}

const Block = ({ children, enableScroll = false }: Props) => {
    return (
        <>
            {enableScroll ? null : <div className={classes.scrollBlocker} />}
            <div className={classes.container}>{children}</div>
        </>
    );
};

export default Block;
