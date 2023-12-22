import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import AuthRoute from './Auth-route';
import PrivateRoute from './Private-route';
import NotFoundPage from '../components/NotFoundPage/NotFoundPage';
import Account from '../container/Account/Account';
import LoginStatus from '../container/LoginStatus/LoginStatus';
import Query from '../container/Query/Query';
import Report from '../container/Report/Report';
import ReportGenerator from '../container/ReportGenerator/ReportGenerator';
import ReportHistory from '../container/ReportHistory/ReportHistory';
import SelfInfo from '../container/SelfInfo/SelfInfo';
import Settings from '../container/Settings/Settings';

function AppRoutes() {
    return (
        <Switch>
            <Redirect exact from="/" to="/home" />
            <PrivateRoute exact path="/home" component={<Query />} />
            {/*<PrivateRoute exact path="/history" component={<History />} />*/}
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
            <PrivateRoute exact path="/report-generator" component={<ReportGenerator />} />
            <PrivateRoute exact path="/selfInfo" component={<SelfInfo />} />
            <Route path="*" component={NotFoundPage} />
        </Switch>
    );
}

export default AppRoutes;
