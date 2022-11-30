import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Account from './container/Account/Account';
import History from './container/History/History';
import Query from './container/Query/Query';
import Report from './container/Report/Report';
import ReportHistory from './container/ReportHistory/ReportHistory';
import Settings from './container/Settings/Settings';
import PrivateRoute from './Private-route';

function AppRoutes() {
    return (
        <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute path="/home" component={<Query />} exact />
            <PrivateRoute
                exact
                path="/reporting/studyInstanceUID/:studyInstanceUID/version/latest"
                component={<Report />}
            />
            <PrivateRoute
                exact
                path="/reporting/history/studyInstanceUID/:studyInstanceUID/version/:version"
                component={<ReportHistory />}
            />
            <PrivateRoute path="/account" component={<Account />} exact />
            <PrivateRoute path="/history" component={<History />} exact />
            <PrivateRoute path="/settings" component={<Settings />} exact />
            <Route path="*" component={NotFoundPage} />
        </Switch>
    );
}

export default AppRoutes;
