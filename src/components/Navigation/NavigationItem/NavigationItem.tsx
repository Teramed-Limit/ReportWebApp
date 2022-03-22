import React from 'react';

import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.scss';

interface Props {
    link: string;
    children?: React.ReactNode;
}

const NavigationItem = ({ link, children }: Props) => {
    return (
        <li className={classes.navigationItem}>
            <NavLink to={`${link}${window.location.search}`} activeClassName={classes.active}>
                {children}
            </NavLink>
        </li>
    );
};

export default NavigationItem;
