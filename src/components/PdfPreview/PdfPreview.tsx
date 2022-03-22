import React, { useState } from 'react';

import { IconContext } from 'react-icons';
import { HiOutlineMinusSm, IoMdAdd } from 'react-icons/all';
import { Document, Page } from 'react-pdf';

import Spinner from '../Spinner/Spinner';
import classes from './PdfPreview.module.scss';

const PdfPreview = (props) => {
    const [pages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.5);

    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
    }

    const { pdf } = props;

    return (
        <div className={classes.container}>
            <div className={classes['zoom-control-wrapper']}>
                <IconContext.Provider
                    value={{
                        color: '#4288f5',
                        size: '24',
                        style: { verticalAlign: 'middle' },
                    }}
                >
                    <button
                        className={classes['icon-button']}
                        type="button"
                        onClick={() => setScale(scale + 0.1)}
                    >
                        <IoMdAdd />
                    </button>
                    <button
                        className={classes['icon-button']}
                        type="button"
                        onClick={() => setScale(scale - 0.1)}
                    >
                        <HiOutlineMinusSm />
                    </button>
                </IconContext.Provider>
            </div>

            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} loading={<Spinner />}>
                {Array.from(new Array(pages), (el, index) => (
                    <Page scale={scale} key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        </div>
    );
};

export default PdfPreview;
