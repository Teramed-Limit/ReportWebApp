import React, { useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Slider, Stack } from '@mui/material';
import { observer } from 'mobx-react';
import { RiZoomInLine, RiZoomOutLine } from 'react-icons/all';

import Gallery from '../../../components/Gallery/Gallery';
import ImageSelector from '../../../components/ImageSelector/ImageSelector';
import Button from '../../../components/UI/Button/Button';
// import { ModalContext } from '../../../context/modal-context';
import { useObjectState } from '../../../hooks/useObjectState';
import { useStore } from '../../../models/useStore';
import classes from './GallerySelector.module.scss';

const optionSource = {
    type: 'http',
    source: 'CapturesMappingFindingsList',
};

const filterCondition = {
    filterById: 'ERSType',
    filterOptionKey: 'ERSType',
};

const GallerySelector = () => {
    // const setModal = useContext(ModalContext);
    const [slider, setSlider] = useState(3);
    const store = useStore();
    const { dataStore, optionStore, imageStore } = store;
    const { reportDisabled } = dataStore;
    const {
        images,
        imageSelectCount,
        onImageCheck,
        onFindingsChanged,
        selectAllImage,
        deselectAllImage,
        onImageReorder,
    } = imageStore;

    const [options] = useObjectState(optionStore.getOptions(optionSource.source, filterCondition));

    return (
        <>
            <div className={classes.header}>Images</div>
            <Stack className={classes['gallery-toolbar']} direction="row" spacing={2}>
                {/* <Button */}
                {/*    disabled={reportDisabled} */}
                {/*    theme="primary" */}
                {/*    onClick={() => setModal(<LoadStudyModal />)} */}
                {/* > */}
                {/*    Load */}
                {/* </Button> */}
                <Button disabled={reportDisabled} theme="primary" onClick={selectAllImage}>
                    Attach All
                </Button>
                <Button disabled={reportDisabled} theme="primary" onClick={deselectAllImage}>
                    Unattached All
                </Button>
                <span className={classes.imageInfo}>
                    Attached: {imageSelectCount} images (max 50 images)
                </span>
                <span className={classes.hint}>
                    <InfoIcon />
                    Reorder images by dragging
                </span>
            </Stack>
            <div className={classes['gallery-wrapper']}>
                <Gallery>
                    {images.map((image, index) => (
                        <ImageSelector
                            disabled={reportDisabled}
                            key={image.SOPInstanceUID}
                            index={index}
                            size={100 / (7 - slider)}
                            id={image.SOPInstanceUID}
                            src={image.ImageSrc}
                            checked={image.IsAttachInReport}
                            findings={image.DescriptionOfFindings}
                            options={options}
                            optionSource={optionSource}
                            markerMappingNumber={image.MappingNumber}
                            onImageCheck={onImageCheck}
                            onFindingsChange={onFindingsChanged}
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
