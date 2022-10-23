import React, { useState } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react';

import Button from '../../../../components/UI/Button/Button';
import { ImageField } from '../../../../interface/image-field';
import { useReportImageStore } from '../../../../models/useStore';
import classes from './Image.module.scss';

interface Props {
    field: ImageField;
    value: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Image = React.forwardRef(({ field, value }: Props, ref) => {
    const { exportDiagramUrl } = useReportImageStore();

    const { imageSource } = field;

    const [imageSrc, setImageSrc] = useState<string>(
        imageSource.type === 'base64' ? `data:image/jpg;base64, ${value}` : value,
    );

    return (
        <>
            <div className={cx(classes.imageContainer)}>
                <img draggable={false} src={imageSrc} alt="None" />
                <Button theme="primary" onClick={() => setImageSrc(exportDiagramUrl())}>
                    Refresh
                </Button>
            </div>
        </>
    );
});

export default observer(Image);
