import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Photo from './container/Photo/Photo';
import Preview from './container/Preview/Preview';
import Query from './container/Query/Query';
import Report from './container/Report/Report';
import PrivateRoute from './Private-route';

function AppRoutes() {
    return (
        <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute path="/home" component={<Query />} exact />
            <PrivateRoute path="/reporting" component={<Report />} exact />
            <PrivateRoute path="/photos" component={<Photo />} exact />
            <PrivateRoute path="/preview" component={<Preview />} exact />
            <Route path="*" component={NotFoundPage} />
        </Switch>
    );
}

export default AppRoutes;
