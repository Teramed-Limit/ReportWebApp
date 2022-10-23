import React, { useEffect, useState } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react';

import { Field } from '../../../../interface/field';
import { useReportImageStore } from '../../../../models/useStore';
import classes from './ReportDiagram.module.scss';

interface Props {
    field: Field;
    value: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReportDiagram = React.forwardRef(({ field, value }: Props, ref) => {
    const { exportDiagramUrl, diagramChanged } = useReportImageStore();

    const [imageSrc, setImageSrc] = useState<string>(`data:image/jpg;base64, ${value}`);

    useEffect(() => {
        const timer = setTimeout(() => {
            const modifiedImage = exportDiagramUrl();
            setImageSrc(modifiedImage);
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, [value, diagramChanged, exportDiagramUrl]);

    return (
        <>
            <div className={cx(classes.imageContainer)}>
                <img draggable={false} src={imageSrc} alt="None" />
            </div>
        </>
    );
});

export default observer(ReportDiagram);
