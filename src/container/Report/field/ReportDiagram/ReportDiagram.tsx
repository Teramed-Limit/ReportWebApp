import React, { useEffect, useState } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react';

import classes from './ReportDiagram.module.scss';
import { Field } from '../../../../interface/field';
import { useReportImageStore } from '../../../../models/useStore';

interface Props {
    field: Field;
    value: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReportDiagram = React.forwardRef(({ field, value }: Props, ref) => {
    const { exportDiagramUrl } = useReportImageStore();
    const [imageUrl, setImageUrl] = useState(value);

    useEffect(() => {
        let requestID;
        const refreshDiagram = () => {
            setImageUrl(exportDiagramUrl());
            requestID = window.requestAnimationFrame(refreshDiagram);
        };
        window.requestAnimationFrame(refreshDiagram);
        return () => cancelAnimationFrame(requestID);
    }, [exportDiagramUrl]);

    return (
        <>
            <div className={cx(classes.imageContainer)}>
                <img src={imageUrl} alt="None" />
            </div>
        </>
    );
});

export default observer(ReportDiagram);
