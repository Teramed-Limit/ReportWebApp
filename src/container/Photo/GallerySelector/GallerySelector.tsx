import React, { useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import { IconButton, Slider, Stack } from '@mui/material';
import { observer } from 'mobx-react';
import { RiZoomInLine, RiZoomOutLine } from 'react-icons/ri';

import classes from './GallerySelector.module.scss';
import Gallery from '../../../components/Gallery/Gallery';
import ImageSelector from '../../../components/ImageSelector/ImageSelector';
import Button from '../../../components/UI/Button/Button';
import {
    useReportDataStore,
    useReportDefineStore,
    useReportImageStore,
} from '../../../models/useStore';
import { isEmptyOrNil } from '../../../utils/general';

const GallerySelector = () => {
    const [lockReorder, setLockReorder] = useState(true);
    const [slider, setSlider] = useState(3);
    const imageStore = useReportImageStore();
    const defineStore = useReportDefineStore();
    const dataStore = useReportDataStore();
    const { modifiable } = dataStore;
    const {
        images,
        imageSelectCount,
        onImageCheck,
        onClearImageMark,
        onImageMark,
        onValueChanged,
        onValueGetter,
        selectAllImage,
        deselectAllImage,
        onImageReorder,
    } = imageStore;

    return (
        <>
            <div className={classes.header}>Images</div>
            <Stack className={classes['gallery-toolbar']} direction="row" spacing={2}>
                <Button disabled={!modifiable} theme="primary" onClick={selectAllImage}>
                    Attach All
                </Button>
                <Button disabled={!modifiable} theme="primary" onClick={deselectAllImage}>
                    Unattached All
                </Button>
                <span className={classes.imageInfo}>
                    Attached: {imageSelectCount} images (max 50 images)
                </span>
                <span className={classes.hint}>
                    <IconButton
                        color={lockReorder ? 'primary' : 'default'}
                        onClick={() => setLockReorder((prev) => !prev)}
                    >
                        {lockReorder ? <LockIcon /> : <NoEncryptionGmailerrorredIcon />}
                    </IconButton>
                    <InfoIcon sx={{ color: 'rgb(255 196 30)' }} />
                    <span style={{ textDecoration: lockReorder ? 'line-through' : 'none' }}>
                        Reorder images by dragging
                    </span>
                    {lockReorder && <>(locked)</>}
                </span>
            </Stack>
            <div className={classes['gallery-wrapper']}>
                <Gallery>
                    {images.map((image, index) => (
                        <ImageSelector
                            disabled={!modifiable}
                            lockReorder={lockReorder}
                            key={image.SOPInstanceUID}
                            fields={defineStore.imageDefine}
                            index={index}
                            size={100 / (7 - slider)}
                            id={image.SOPInstanceUID}
                            src={
                                isEmptyOrNil(image?.EditedImageSrc)
                                    ? image.ImageSrc
                                    : image.EditedImageSrc
                            }
                            checked={image.IsAttachInReport}
                            markerMappingNumber={image.MappingNumber}
                            onImageCheck={onImageCheck}
                            onClearImageMark={onClearImageMark}
                            onImageMark={onImageMark}
                            onValueChanged={onValueChanged}
                            onValueGetter={onValueGetter}
                            onImageReorder={onImageReorder}
                        />
                    ))}
                </Gallery>
            </div>
            <div className={classes['slider-wrapper']}>
                <IconButton
                    className={classes.sliderButton}
                    component="span"
                    onClick={() => setSlider((v) => (v === 1 ? v : v - 1))}
                    size="large"
                >
                    <RiZoomOutLine />
                </IconButton>
                <Slider
                    className={classes['gallery-slider']}
                    value={slider}
                    track={false}
                    marks
                    onChange={(event, value: number | number[]) => setSlider(value as number)}
                    step={1}
                    min={1}
                    max={6}
                />
                <IconButton
                    className={classes.sliderButton}
                    component="span"
                    onClick={() => setSlider((v) => (v === 6 ? v : v + 1))}
                    size="large"
                >
                    <RiZoomInLine />
                </IconButton>
            </div>
        </>
    );
};

export default observer(GallerySelector);
