import React from 'react';

import { FaCheck } from 'react-icons/fa';
import { IoMdWarning } from 'react-icons/io';

import classes from './IconCell.module.scss';

const IconCell = (prop) => {
    const renderComp = () => {
        switch (prop.value) {
            case 'NG':
                return <IoMdWarning className={`${classes.icon} ${classes.warning}`} />;
            case 'OK':
                return <FaCheck className={`${classes.icon} ${classes.ok}`} />;
            default:
                return null;
        }
    };

    return <>{renderComp()}</>;
};

export default IconCell;
