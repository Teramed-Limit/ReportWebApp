import React from 'react';

import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';

import { useReportDataStore } from './models/useStore';

interface Props {
    exact: boolean;
    path: string;
    component: JSX.Element;
}

function PrivateRoute({ component, ...rest }: Props) {
    const { reportReady } = useReportDataStore();
    return (
        <Route
            {...rest}
            render={() =>
                reportReady !== 'error' ? component : <Redirect to={{ pathname: '/error' }} />
            }
        />
    );
}

export default observer(PrivateRoute);
