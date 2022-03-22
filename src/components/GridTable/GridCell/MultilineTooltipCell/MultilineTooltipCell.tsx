import React, { forwardRef, useImperativeHandle } from 'react';

import classes from './MultilineTooltipCell.module.scss';

const MultilineTooltipCell = forwardRef((props: any, ref) => {
    useImperativeHandle(ref, () => {
        return {
            getReactContainerClasses() {
                return ['custom-tooltip'];
            },
        };
    });

    return (
        <div className={classes.container}>
            <p className={classes.paragraph}>{props.value}</p>
        </div>
    );
});

export default MultilineTooltipCell;
