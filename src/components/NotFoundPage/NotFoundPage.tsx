import React from 'react';

import classes from './NotFoundPage.module.scss';

const NotFoundPage = () => {
    return (
        <div className={classes.container}>
            <div className={classes.page}>
                <div />
                <h1>404</h1>
                <h2>Oops! Page Not Be Found</h2>
            </div>
        </div>
    );
};

export default NotFoundPage;
