import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import NotFoundPage from '../components/NotFoundPage/NotFoundPage';
import Account from '../container/Account/Account';
import History from '../container/History/History';
import LoginStatus from '../container/LoginStatus/LoginStatus';
import Query from '../container/Query/Query';
import Report from '../container/Report/Report';
import ReportGenerator from '../container/ReportGenerator/ReportGenerator';
import ReportHistory from '../container/ReportHistory/ReportHistory';
import Settings from '../container/Settings/Settings';
import AdminRoute from './Admin-route';
import AuthRoute from './Auth-route';
import PrivateRoute from './Private-route';

function AppRoutes() {
    return (
        <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute exact path="/home" component={<Query />} />
            <PrivateRoute exact path="/history" component={<History />} />
            <PrivateRoute
                exact
                path="/reporting/history/studyInstanceUID/:studyInstanceUID/version/:version"
                component={<ReportHistory />}
            />
            <AuthRoute
                id="navigation__report"
                exact
                path="/reporting/studyInstanceUID/:studyInstanceUID/version/latest"
                component={<Report />}
            />
            <AuthRoute
                id="navigation__loginStatusManagement"
                exact
                path="/login-status-management"
                component={<LoginStatus />}
            />
            <AuthRoute id="navigation__account" exact path="/account" component={<Account />} />
            <AuthRoute id="navigation__setting" exact path="/settings" component={<Settings />} />
            <AdminRoute exact path="/report-generator" component={<ReportGenerator />} />
            <Route path="*" component={NotFoundPage} />
        </Switch>
    );
}

export default AppRoutes;
