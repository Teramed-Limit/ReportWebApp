import React from 'react';

import { FaFilePdf } from 'react-icons/all';

import { generateUUID } from '../../../../utils/general';
import classes from './FileCell.module.scss';

const FileCell = (props) => {
    return (
        <>
            {props.value ? (
                <>
                    <FaFilePdf className={classes.fileIcon} />
                    <a
                        target="_blank"
                        href={`${props.value}?a=${generateUUID()}`}
                        download={props.rel}
                        rel="noreferrer"
                    >
                        pdf link
                    </a>
                </>
            ) : null}
        </>
    );
};

export default FileCell;
