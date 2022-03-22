import React from 'react';

import classes from './TabPanel.module.scss';

interface Props {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: Props) {
    return (
        <div className={classes.container} hidden={value !== index}>
            {value === index ? children : null}
        </div>
    );
}

export default TabPanel;
