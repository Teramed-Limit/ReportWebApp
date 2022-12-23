import React from 'react';

import cx from 'classnames';

import { Field } from '../../../../interface/field';
import classes from './ReportDiagram.module.scss';

interface Props {
    field: Field;
    value: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReportDiagram = React.forwardRef(({ field, value }: Props, ref) => {
    return (
        <>
            <div className={cx(classes.imageContainer)}>
                <img draggable={false} src={value} alt="None" />
            </div>
        </>
    );
});

export default ReportDiagram;
