import React from 'react';

import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.scss';

interface Props {
    id?: string;
    link: string;
    children?: React.ReactNode;
}

const NavigationItem = ({ id, link, children }: Props) => {
    return (
        <li id={id} className={classes.navigationItem}>
            <NavLink to={`${link}${window.location.search}`} activeClassName={classes.active}>
                <>{children}</>
            </NavLink>
        </li>
    );
};

export default NavigationItem;
