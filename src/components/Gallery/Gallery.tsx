import React from 'react';

import classes from './Gallery.module.css';

interface GalleryProps {
    children?: React.ReactNode;
}

const Gallery = ({ children }: GalleryProps) => {
    return <div className={classes.gallery}>{children}</div>;
};

export default Gallery;
