import React from 'react';

import classes from './Button-Group.module.css';

interface ButtonGroupProps {
    children: React.ReactNode;
}

// TODO: add content provider to integrate all buttons
const ButtonGroup = (props: ButtonGroupProps) => {
    return <div className={classes.root}>{props.children}</div>;
};

export default ButtonGroup;
