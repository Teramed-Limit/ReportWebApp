import React from 'react';

import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Consumable from './container/Consumable/Consumable';
import Drug from './container/Drug/Drug';
import Lab from './container/Lab/Lab';
import Photo from './container/Photo/Photo';
import Preview from './container/Preview/Preview';
import Report from './container/Report/Report';
import PrivateRoute from './Private-route';

function AppRoutes() {
    const location = useLocation();
    const queryStr = location.search;
    return (
        <Switch>
            <Redirect exact from="/" to={`/reporting${queryStr}`} />
            <PrivateRoute path="/reporting" component={<Report />} exact />
            <PrivateRoute path="/photos" component={<Photo />} exact />
            <PrivateRoute path="/drag" component={<Drug />} exact />
            <PrivateRoute path="/lab" component={<Lab />} exact />
            <PrivateRoute path="/consumable" component={<Consumable />} exact />
            <PrivateRoute path="/preview" component={<Preview />} exact />
            <Route path="*" component={NotFoundPage} />
        </Switch>
    );
}

export default AppRoutes;
