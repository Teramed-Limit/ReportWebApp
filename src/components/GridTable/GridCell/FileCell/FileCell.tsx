import React from 'react';

import { FaFilePdf } from 'react-icons/fa';

import classes from './FileCell.module.scss';
import { generateUUID } from '../../../../utils/general';

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
