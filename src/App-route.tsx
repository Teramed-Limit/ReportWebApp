import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Account from './container/Account/Account';
import Query from './container/Query/Query';
import Report from './container/Report/Report';
import Settings from './container/Settings/Settings';
import PrivateRoute from './Private-route';

function AppRoutes() {
    return (
        <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute path="/home" component={<Query />} exact />
            <PrivateRoute path="/reporting" component={<Report />} exact />
            <PrivateRoute path="/account" component={<Account />} exact />
            <PrivateRoute path="/settings" component={<Settings />} exact />
            <Route path="*" component={NotFoundPage} />
        </Switch>
    );
}

export default AppRoutes;
