import React, { useContext, useEffect, useState } from 'react';

import { IconButton, Slider } from '@material-ui/core';
import { observer } from 'mobx-react';
import { RiZoomInLine, RiZoomOutLine } from 'react-icons/all';

import Gallery from '../../../components/Gallery/Gallery';
import ImageSelector from '../../../components/ImageSelector/ImageSelector';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { useObjectState } from '../../../hooks/useObjectState';
import { useStore } from '../../../models/useStore';
import LoadStudyModal from '../../Modals/LoadStudyModal/LoadStudyModal';
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
    const setModal = useContext(ModalContext);
    const [slider, setSlider] = useState(3);
    const [col, setCol] = useState(0);
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

    useEffect(() => {
        if (images.length > slider) {
            setCol(Math.ceil(images.length / slider));
        } else {
            setCol(slider);
        }
    }, [images.length, slider]);

    return (
        <>
            <div className={classes['gallery-toolbar']}>
                <Button
                    disabled={reportDisabled}
                    theme="primary"
                    onClick={() => setModal(<LoadStudyModal />)}
                >
                    Load
                </Button>
                <Button disabled={reportDisabled} theme="primary" onClick={selectAllImage}>
                    Attach All
                </Button>
                <Button disabled={reportDisabled} theme="primary" onClick={deselectAllImage}>
                    Unattached All
                </Button>
                <span className={classes.imageInfo}>
                    Attached: {imageSelectCount} images (max 50 images)
                </span>
            </div>
            <div className={classes['gallery-wrapper']}>
                <Gallery row={7 - slider} col={col}>
                    {images.map((image, index) => (
                        <ImageSelector
                            disabled={reportDisabled}
                            key={image.SOPInstanceUID}
                            index={index}
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
                <div className={classes['slider-wrapper']}>
                    <IconButton
                        className={classes.sliderButton}
                        component="span"
                        onClick={() => setSlider((v) => (v === 1 ? v : v - 1))}
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
                    >
                        <RiZoomInLine />
                    </IconButton>
                </div>
            </div>
        </>
    );
};

export default observer(GallerySelector);
