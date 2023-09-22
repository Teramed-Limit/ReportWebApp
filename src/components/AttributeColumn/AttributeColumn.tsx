import React from 'react';

import classes from './AttributeColumn.module.scss';

export interface Props {
    columnKey: string;
    children?: React.ReactNode;
}

const AttributeColumn = ({ columnKey, children }: Props) => {
    return (
        <div className={classes.attributeColumn} key={columnKey}>
            <div className={classes.attributeName}>{columnKey}</div>
            <div className={classes.attributeValue}>{children}</div>
        </div>
    );
};

export default React.memo(AttributeColumn);
