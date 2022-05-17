import React from 'react';

import GallerySelector from './GallerySelector/GallerySelector';
import classes from './Photo.module.css';
import ReportImage from './ReportImage/ReportImage';

const Photo = () => {
    return (
        <div className={classes.container}>
            <div className={classes[`gallery-container`]}>
                <GallerySelector />
            </div>
            <div className={classes[`side-container`]}>
                <ReportImage />
            </div>
        </div>
    );
};

export default Photo;
