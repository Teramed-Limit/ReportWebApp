import React from 'react';

import classes from './Gallery.module.css';

interface GalleryProps {
    col: number;
    row?: number;
    children?: React.ReactNode;
}

const Gallery = ({ row = 2, col = 2, children }: GalleryProps) => {
    const styles = {
        // 2px is for grid gap
        gridTemplateColumns: `repeat(${row}, calc(${100 / row}% - 2px)`,
        gridTemplateRows: `repeat(${col}, calc(${100 / row}% - 2px)`,
    };

    return (
        <div style={styles as React.CSSProperties} className={classes.gallery}>
            {children}
        </div>
    );
};

export default Gallery;
