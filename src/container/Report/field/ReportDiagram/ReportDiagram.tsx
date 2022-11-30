import React, { useEffect, useRef, useState } from 'react';

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

    const [imageSrc, setImageSrc] = useState<string>(value);

    // const lastDiagramChangedMark = useRef('');
    // useEffect(() => {
    //     if (lastDiagramChangedMark.current === diagramChanged) return;
    //     const modifiedImage = exportDiagramUrl();
    //     if (!modifiedImage) return;
    //     setImageSrc(modifiedImage);
    //     lastDiagramChangedMark.current = diagramChanged;
    // }, [diagramChanged, exportDiagramUrl]);

    const lastBase64 = useRef('');
    useEffect(() => {
        const timer = setInterval(() => {
            const modifiedImage = exportDiagramUrl();
            if (lastBase64.current === modifiedImage) return;
            setImageSrc(modifiedImage);
            lastBase64.current = modifiedImage;
        }, 200);

        return () => clearInterval(timer);
    }, [diagramChanged, exportDiagramUrl]);

    return (
        <>
            <div className={cx(classes.imageContainer)}>
                <img draggable={false} src={imageSrc} alt="None" />
            </div>
        </>
    );
});

export default observer(ReportDiagram);
